#version 130
const float PI = radians(180.);
const float TAU = 2.*PI;
float clip(float a) { return clamp(a,-1.,1.); }
float smstep(float a, float b, float x) {return smoothstep(a, b, clamp(x, a, b));}
float theta(float x) { return smstep(0.,1e-3,x); }
float _sin(float a) { return sin(TAU * mod(a,1.)); }
float _sin_(float a, float p) { return sin(TAU * mod(a,1.) + p); }
float _sq_(float a,float pwm) { return sign(2.*fract(a) - 1. + pwm); }
float _tri(float a) { return (4.*abs(fract(a)-.5) - 1.); }
float freqC1(float note){ return 32.7 * exp2(note/12.); }
float minus1hochN(int n) { return (1. - 2.*float(n % 2)); }
float minus1hochNminus1halbe(int n) { return sin(.5*PI*float(n)); }
float pseudorandom(float x) { return fract(sin(dot(vec2(x),vec2(12.9898,78.233))) * 43758.5453); }
float fhelp(float x) { return 1. + .333*x; } // 1. + .33333*x + .1*x*x + .02381*x*x*x + .00463*x*x*x*x;
float linmix(float x, float a, float b, float y0, float y1) { return mix(y0,y1,clamp(a*x+b,0.,1.)); }
float s_atan(float a) { return .636 * atan(a); }
float doubleslope(float t, float a, float d, float s) { return smstep(-.00001,a,t) - (1.-s) * smstep(0.,d,t-a); }
float s_moothmin(float a, float k) {
    float ha = max(1.-2.*abs(abs(a)-1.), 0.);
    return a >= 0. ? min(a, 1.) - .5/6.*ha*ha*ha : max(a, -1.) + .5/6.*ha*ha*ha;
}
float s_moothmin(float a) { return s_moothmin(a,.5); }

#define SONGLENGTH 102.4749
#define NTIME 6
const float pos_B[6] = float[6](0.,12.,14.,16.,17.,62.);
const float pos_t[6] = float[6](0.,25.7143,30.2426,35.0426,35.8321,100.1178);
const float pos_BPS[5] = float[5](.4667,.4417,.4167,1.2666,.7);
const float pos_SPB[5] = float[5](2.1427,2.264,2.3998,.7895,1.4286);
float BPS, SPB, BT;

float Tsample;

#define filterthreshold 1.e-3

//TEXCODE

float drop_phase(float time, float t1, float f0, float f1)
{
    float t = min(time, t1);
    float phi = f0*t + .5*(f1-f0)/t1*t*t;

    if(time > t1)
    {
        phi += f1 * (time - t1);
    }
    return phi;
}

float lpnoise(float t, float fq)
{
    t *= fq;
    float tt = fract(t);
    float tn = t - tt;
    return mix(pseudorandom(floor(tn) / fq), pseudorandom(floor(tn + 1.0) / fq), smstep(0.0, 1.0, tt));
}

float env_AHDSR(float x, float L, float A, float H, float D, float S, float R)
{
    return (x<A ? x/A : x<A+H ? 1. : x<A+H+D ? (1. - (1.-S)*(x-H-A)/D) : x<=L-R ? S : x<=L ? S*(L-x)/R : 0.);
}

float env_AHDSRexp(float x, float L, float A, float H, float D, float S, float R)
{
    float att = pow(x/A,8.);
    float dec = S + (1.-S) * exp(-(x-H-A)/D);
    float rel = (x <= L-R) ? 1. : pow((L-x)/R,4.);
    return (x < A ? att : x < A+H ? 1. : dec) * rel;
}

float waveshape(float s, float amt, float A, float B, float C, float D, float E)
{
    float w;
    float m = sign(s);
    s = abs(s);

    if(s<A) w = B * smstep(0.,A,s);
    else if(s<C) w = C + (B-C) * smstep(C,A,s);
    else if(s<=D) w = s;
    else if(s<=1.)
    {
        float _s = (s-D)/(1.-D);
        w = D + (E-D) * (1.5*_s*(1.-.33*_s*_s));
    }
    else return 1.;

    return m*mix(s,w,amt);
}

float sinshape(float x, float amt, float parts)
{
    return (1.-amt) * x + amt * sign(x) * 0.5 * (1. - cos(parts*PI*x));
}

float comp_SAW(int N, float inv_N, float PW) {return inv_N * (1. - _sin(float(N)*PW));}
float comp_TRI(int N, float inv_N, float PW) {return N % 2 == 0 ? .1 * inv_N * _sin(float(N)*PW) : inv_N * inv_N * (1. - _sin(float(N)*PW));}
float comp_SQU(int N, float inv_N, float PW) {return inv_N * (minus1hochN(N) * _sin(.5*float(N)*PW + .25) - 1.);}
float comp_HAE(int N, float inv_N, float PW) {return N % 2 == 0 ? 0. : inv_N * (1. - minus1hochNminus1halbe(N))*_sin(PW);}
float comp_OBO(int N, float inv_N, float PW) {return sqrt(inv_N) * (1. + _sin(float(N)*(1.5+PW)+.5*PI));}

float MADD(float t, float f, float p0, int NMAX, int NINC, float MIX, float CO, float NDECAY, float RES, float RES_Q, float DET, float PW, float LOWCUT, float keyF)
{
    float ret = 0.;
    float f_ = keyF > .99 ? 1. : (keyF < 1.e-3 ? f : pow(f, 1.-keyF));
    float INR = f_/CO;
    float IRESQ = 1./(RES_Q*f_);

    float p = f*t;
    float float_N, inv_N, comp_mix, filter_N;
    for(int N = 1 + int(LOWCUT/f - 1.e-3); N<=NMAX; N+=NINC)
    {
        float_N = float(N);
        inv_N = 1./float_N;
        comp_mix = MIX < -1. ? (MIX+2.) * comp_SAW(N,inv_N,PW)  - (MIX+1.) * comp_OBO(N,inv_N,PW)
                 : MIX <  0. ? (MIX+1.) * comp_TRI(N,inv_N,PW)  -     MIX  * comp_SAW(N,inv_N,PW)
                 : MIX < 1. ? (1.-MIX) * comp_TRI(N,inv_N,PW)  +     MIX  * comp_SQU(N,inv_N,PW)
                            : (MIX-1.) * comp_HAE(N,inv_N,PW)  + (2.-MIX) * comp_SQU(N,inv_N,PW);

        if(abs(comp_mix) < 1e-4) continue;

        filter_N = pow(1. + pow(float_N*INR,NDECAY),-.5) + RES * exp(-pow((float_N*f-CO)*IRESQ,2.));

        ret += comp_mix * filter_N * (_sin_(float_N * p, p0) + _sin_(float_N * p * (1.+DET), p0));
    }
    return s_moothmin(ret);
}

float MADD(float t, float f, float p0, int NMAX, int NINC, float MIX, float CO, float NDECAY, float RES, float RES_Q, float DET, float PW, int keyF)
{
    return MADD(t, f, p0, NMAX, NINC, MIX, CO, NDECAY, RES, RES_Q, DET, PW, 0., keyF);
}

float QFM_FB(float PH, float FB) // my guessing of feedback coefficients, FB>0 'saw', FB<0 'sq'
{
    if(FB > 0.) return abs(FB) * .8*_sin(PH + .35*_sin(PH));
    else return abs(FB) * _sin(PH + .5*PI);
}

float QFM(float t, float f, float phase, float LV1, float LV2, float LV3, float LV4, float FR1, float FR2, float FR3, float FR4, float FB1, float FB2, float FB3, float FB4, float ALGO)
{
    int iALGO = int(ALGO);
    float PH1 = FR1 * f * t + phase;
    float PH2 = FR2 * f * t + phase;
    float PH3 = FR3 * f * t + phase;
    float PH4 = FR4 * f * t + phase;

    float LINK41 = 0., LINK42 = 0., LINK43 = 0., LINK32 = 0., LINK31 = 0., LINK21 = 0.;
    if(iALGO == 1)       {LINK43 = 1.; LINK32 = 1.; LINK21 = 1.;}
    else if(iALGO == 2)  {LINK42 = 1.; LINK32 = 1.; LINK21 = 1.;}
    else if(iALGO == 3)  {LINK41 = 1.; LINK32 = 1.; LINK21 = 1.;}
    else if(iALGO == 4)  {LINK42 = 1.; LINK43 = 1.; LINK31 = 1.; LINK21 = 1.;}
    else if(iALGO == 5)  {LINK41 = 1.; LINK31 = 1.; LINK21 = 1.;}
    else if(iALGO == 6)  {LINK43 = 1.; LINK32 = 1.;}
    else if(iALGO == 7)  {LINK43 = 1.; LINK32 = 1.; LINK31 = 1.;}
    else if(iALGO == 8)  {LINK21 = 1.; LINK43 = 1.;}
    else if(iALGO == 9)  {LINK43 = 1.; LINK42 = 1.; LINK41 = 1.;}
    else if(iALGO == 10) {LINK43 = 1.; LINK42 = 1.;}
    else if(iALGO == 11) {LINK43 = 1.;}

    float OP4 = LV4 * _sin(PH4 + QFM_FB(PH4, FB4));
    float OP3 = LV3 * _sin(PH3 + QFM_FB(PH3, FB3) + LINK43*OP4);
    float OP2 = LV2 * _sin(PH2 + QFM_FB(PH2, FB2) + LINK42*OP4 + LINK32*OP3);
    float OP1 = LV1 * _sin(PH1 + QFM_FB(PH1, FB1) + LINK41*OP4 + LINK31*OP3 + LINK21*OP2);

    float sum = OP1;
    if(LINK21 > 0.) sum += OP2;
    if(LINK31 + LINK32 > 0.) sum += OP3;
    if(LINK41 + LINK42 + LINK43 > 0.) sum += OP4;

    return s_moothmin(sum);
}

float sfqm_vol(float _BEAT)
{
    return _BEAT<0 ? 0. : 1.;
}
float _BOOMENV0(float t){return t <=.019? linmix(t,52.6316,0.,0.,1.):t <=.244? linmix(t,4.4444,-.0844,1.,.274):t <=1.2? linmix(t,1.046,-.2552,.274,0.):0.;}
float _BOOMENV1(float t){return t <=.147? linmix(t,6.8027,0.,0.,1.):t <=.488? linmix(t,2.9326,-.4311,1.,.417):t <=1.058? linmix(t,1.7544,-.8561,.417,0.):0.;}
float _BOOMENV2(float t){return t <=.259? linmix(t,3.861,0.,0.,1.):t <=.868? linmix(t,1.642,-.4253,1.,.464):t <=1.947? linmix(t,.9268,-.8044,.464,0.):0.;}
float _BOOMENV3(float t){return t <=.62? linmix(t,1.6129,0.,0.,1.):t <=1.899? linmix(t,.7819,-.4848,1.,0.):0.;}
float maceboss_vol(float B)
{
    return B<0. ? 0. : (B>=0. && B<4.) ? 0. : (B>=4. && B<6.) ? linmix(B, .5, -2., 0.0, 0.2) : (B>=6. && B<8.) ? linmix(B, .5, -3., 0.2, 0.4) : (B>=8. && B<12.) ? linmix(B, .25, -2., 0.4, 1.0) : (B>=14. && B<16.) ? linmix(B, .5, -7., 1.0, 0.5) : 1.;
}
float pluck7short_vol(float B)
{
    return B<0. ? 0. : (B>=0. && B<1.5) ? .02 : (B>=1.5 && B<8.) ? linmix(B, .1538, -.2308, 0.02, 0.3) : (B>=8. && B<15.) ? linmix(B, .1429, -1.1429, 0.3, 0.7) : (B>=15. && B<16.) ? linmix(B, 1., -15., 0.7, 0.2) : 1.;
}
float SUBvol(float B)
{
    return B<0. ? 0. : 1.;
}

uniform float iBlockOffset;
uniform float iSampleRate;
uniform float iTexSize;
uniform sampler2D iSequence;
uniform float iSequenceWidth;

// Read short value from texture at index off
float rshort(in float off)
{
    float hilo = mod(off, 2.);
    off = .5*off;
    vec2 ind = vec2(mod(off, iSequenceWidth), floor(off/iSequenceWidth));
    vec4 block = texelFetch(iSequence, ivec2(ind), 0);
    vec2 data = mix(block.rg, block.ba, hilo);
    return round(dot(vec2(255., 65280.), data));
}

// Read float value from texture at index off
float rfloat(int off)
{
    float d = rshort(float(off));
    float sign = floor(d/32768.),
        exponent = floor(d*9.765625e-4 - sign*32.),
        significand = d-sign*32768.-exponent*1024.;

    if(exponent == 0.)
         return mix(1., -1., sign) * 5.960464477539063e-08 * significand;
    return mix(1., -1., sign) * (1. + significand * 9.765625e-4) * pow(2.,exponent-15.);
}

#define NTRK 10
#define NMOD 74
#define NPTN 18
#define NNOT 1092
#define NDRM 52

int trk_sep(int index)      {return int(rfloat(index));}
int trk_syn(int index)      {return int(rfloat(index+1+1*NTRK));}
float trk_norm(int index)   {return     rfloat(index+1+2*NTRK);}
float trk_rel(int index)    {return     rfloat(index+1+3*NTRK);}
float trk_pre(int index)    {return     rfloat(index+1+4*NTRK);}
float trk_slide(int index)  {return     rfloat(index+1+5*NTRK);} // idea for future: change to individual note_slide_time
float mod_on(int index)     {return     rfloat(index+1+6*NTRK);}
float mod_off(int index)    {return     rfloat(index+1+6*NTRK+1*NMOD);}
int mod_ptn(int index)      {return int(rfloat(index+1+6*NTRK+2*NMOD));}
float mod_transp(int index) {return     rfloat(index+1+6*NTRK+3*NMOD);}
int ptn_sep(int index)      {return int(rfloat(index+1+6*NTRK+4*NMOD));}
float note_on(int index)    {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN);}
float note_off(int index)   {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+1*NNOT);}
float note_pitch(int index) {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+2*NNOT);}
float note_pan(int index)   {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+3*NNOT);}
float note_vel(int index)   {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+4*NNOT);}
float note_slide(int index) {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+5*NNOT);}
float note_aux(int index)   {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+6*NNOT);}
float drum_rel(int index)   {return     rfloat(index+2+6*NTRK+4*NMOD+NPTN+7*NNOT);}

vec2 mainSynth(float time)
{
    float sL = 0.;
    float sR = 0.;
    float dL = 0.;
    float dR = 0.;

    if (time > SONGLENGTH) return vec2(0.);
    
    int _it;
    for(_it = 0; _it < NTIME - 2 && pos_t[_it + 1] < time; _it++);
    BPS = pos_BPS[_it];
    SPB = pos_SPB[_it];
    BT = pos_B[_it] + (time - pos_t[_it]) * BPS;

    float time2 = time - .0002;
    float sidechain = 1.;

    float amaysynL, amaysynR, amaydrumL, amaydrumR, B, Bon, Boff, Bprog, Bproc, L, tL, _t, _t2, vel, rel, pre, f, amtL, amtR, env, slide, aux;
    int tsep0, tsep1, _modU, _modL, ptn, psep0, psep1, _noteU, _noteL, syn, drum;

    for(int trk = 0; trk < NTRK; trk++)
    {
        tsep0 = trk_sep(trk);
        tsep1 = trk_sep(trk + 1);

        syn = trk_syn(trk);
        rel = trk_rel(trk) + 1.e-3;
        pre = trk_pre(trk);

        for(_modU = tsep0; (_modU < tsep1 - 1) && (BT > mod_on(_modU + 1) - pre); _modU++);
        for(_modL = tsep0; (_modL < tsep1 - 1) && (BT >= mod_off(_modL) + rel); _modL++);

        for(int _mod = _modL; _mod <= _modU; _mod++)
        {
            B = BT - mod_on(_mod) + pre;

            ptn   = mod_ptn(_mod);
            psep0 = ptn_sep(ptn);
            psep1 = ptn_sep(ptn + 1);

            for(_noteU = psep0; (_noteU < psep1 - 1) && (B > note_on(_noteU + 1)); _noteU++);
            for(_noteL = psep0; (_noteL < psep1 - 1) && (B >= note_off(_noteL) + rel); _noteL++);

            for(int _note = _noteL; _note <= _noteU; _note++)
            {
                if(syn == 139)
                {
                    drum = int(note_pitch(_note));
                    rel = drum_rel(drum) + 1.e-3;
                }

                amaysynL  = 0.;
                amaysynR  = 0.;
                amaydrumL = 0.;
                amaydrumR = 0.;

                Bon   = note_on(_note);
                Boff  = note_off(_note) + rel;
                L     = Boff - Bon;
                tL    = L * SPB;
                Bprog = max(0., B - Bon); // I DO NOT GET THIS WEIRD FIX, but Revision is approaching
                Bproc = Bprog / L;
                _t    = Bprog * SPB; 
                _t2   = _t - .0002; // this is on purpose not max(0., _t - .0002), because I hope future-QM is clever
                vel   = note_vel(_note);
                amtL  = clamp(1. - note_pan(_note), 0., 1.);
                amtR  = clamp(1. + note_pan(_note), 0., 1.);
                slide = note_slide(_note);
                aux   = note_aux(_note);

                if(syn == 139)
                {
                    env = trk_norm(trk) * theta(Bprog) * theta(L - Bprog);
                    if(drum == 0) { sidechain = min(sidechain, 1. - vel * (clamp(1.e4 * Bprog,0.,1.) - pow(Bprog/(L-rel),8.)));}
                    else if(drum == 12){
                        amaydrumL = vel*1.2*fract(sin(_t*100.*.5)*50000.*.5)*doubleslope(_t,0.,.03,.1)*exp(-13.*Bprog);
                        amaydrumR = vel*1.2*fract(sin(_t2*100.*.5)*50000.*.5)*doubleslope(_t2,0.,.03,.1)*exp(-13.*Bprog);
                    }
                    else if(drum == 20){
                        amaydrumL = vel*(.79*lpnoise(_t,1.+3.31*_t)*(smstep(0.,1e-3,_t)-smstep(0.,.018,_t-.196)));
                        amaydrumR = vel*(.79*lpnoise(_t2,1.+3.31*_t2)*(smstep(0.,1e-3,_t2)-smstep(0.,.018,_t2-.196)));
                    }
                    else if(drum == 21){
                        amaydrumL = vel*((clamp(1.09*_tri(drop_phase(_t,.08,249.,77.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.04))+.97*clamp(.99*_tri(drop_phase(_t,.08,249.,77.)+.97*lpnoise(_t,9855.)),-1.,1.)*exp(-21.22*_t)+.03*lpnoise(_t,10655.)*(1.-smstep(0.,.58,_t-.81))+.71*lpnoise(_t,7520.)*exp(-_t*16.22)+.57*lpnoise(_t,4386.)*exp(-_t*29.48))*smstep(0.,.005,_t));
                        amaydrumR = vel*((clamp(1.09*_tri(drop_phase(_t2,.08,249.,77.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.04))+.97*clamp(.99*_tri(drop_phase(_t2,.08,249.,77.)+.97*lpnoise(_t2,9855.)),-1.,1.)*exp(-21.22*_t2)+.03*lpnoise(_t2,10655.)*(1.-smstep(0.,.58,_t2-.81))+.71*lpnoise(_t2,7520.)*exp(-_t2*16.22)+.57*lpnoise(_t2,4386.)*exp(-_t2*29.48))*smstep(0.,.005,_t2));
                    }
                    else if(drum == 27){
                        amaydrumL = vel*(.61*(0.*lpnoise(_t,385.)+0.*lpnoise(_t,2973.)+0.*lpnoise(_t,1554.))*(smstep(0.,.01,_t)-smstep(0.,.54,_t-.02))+_sin(drop_phase(_t,.03,638.,304.))*exp(-_t*9.7)*.1+_sin(drop_phase(_t*1541.,.03,638.,304.))*exp(-_t*2.8)*.91);
                        amaydrumR = vel*(.61*(0.*lpnoise(_t2,385.)+0.*lpnoise(_t2,2973.)+0.*lpnoise(_t2,1554.))*(smstep(0.,.01,_t2)-smstep(0.,.54,_t2-.02))+_sin(drop_phase(_t2,.03,638.,304.))*exp(-_t2*9.7)*.1+_sin(drop_phase(_t2*1541.,.03,638.,304.))*exp(-_t2*2.8)*.91);
                    }
                    else if(drum == 29){
                        amaydrumL = vel*(_BOOMENV0(_t)*(1.6*(.5*_sin_(drop_phase(_t,.046,273.108,73.441),1.7*_BOOMENV0(_t)*lpnoise(_t,452.603))+.5*_sin_(.983*drop_phase(_t,.046,273.108,73.441),1.7*_BOOMENV0(_t)*lpnoise(_t,452.603))))+_BOOMENV1(_t)*(1.25*lpnoise(_t,452.603))+_BOOMENV2(_t)*(1.45*lpnoise(_t,212.15))+_BOOMENV3(_t)*(1.85*lpnoise(_t,141.624)));
                        amaydrumR = vel*(_BOOMENV0(_t)*(1.6*(.5*_sin_(drop_phase((_t-.00089),.046,273.108,73.441),1.7*_BOOMENV0(_t)*lpnoise((_t-.00089),452.603))+.5*_sin_(.983*drop_phase((_t-.00089),.046,273.108,73.441),1.7*_BOOMENV0(_t)*lpnoise((_t-.00089),452.603))))+_BOOMENV1(_t)*(1.25*lpnoise((_t-.00011),452.603))+_BOOMENV2(_t)*(1.45*lpnoise((_t-.00173),212.15))+_BOOMENV3(_t)*(1.85*lpnoise((_t-.002),141.624)));
                    }
                    else if(drum == 32){
                        amaydrumL = vel*((clamp(2.65*_tri(drop_phase(_t,.06,205.,52.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.09))+.91*clamp(.95*_tri(drop_phase(_t,.06,205.,52.)+.91*lpnoise(_t,8869.)),-1.,1.)*exp(-14.86*_t)+.04*lpnoise(_t,16440.)*(1.-smstep(0.,.77,_t-.52))+.16*lpnoise(_t,1524.)*exp(-_t*6.23)+.07*lpnoise(_t,5944.)*exp(-_t*13.51))*smstep(0.,.004,_t));
                        amaydrumR = vel*((clamp(2.65*_tri(drop_phase(_t2,.06,205.,52.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.09))+.91*clamp(.95*_tri(drop_phase(_t2,.06,205.,52.)+.91*lpnoise(_t2,8869.)),-1.,1.)*exp(-14.86*_t2)+.04*lpnoise(_t2,16440.)*(1.-smstep(0.,.77,_t2-.52))+.16*lpnoise(_t2,1524.)*exp(-_t2*6.23)+.07*lpnoise(_t2,5944.)*exp(-_t2*13.51))*smstep(0.,.004,_t2));
                    }
                    else if(drum == 38){
                        amaydrumL = vel*(vel*(clamp(1.32*_tri(drop_phase(_t,.06,308.,80.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.15))+.82*clamp(.49*_tri(drop_phase(_t,.06,308.,80.))+.082*lpnoise(_t,4595.),-1.,1.)*exp(-1.97*_t)+.09*lpnoise(_t,4032.)*(1.-smstep(0.,.97,_t-.79))+.1*lpnoise(_t,1111.)*exp(-_t*12.69)+.16*lpnoise(_t,7795.)*exp(-_t*1.08))*smstep(0.,.003,_t))
      +.5*((clamp(1.35*_tri(drop_phase(_t,.07,244.,112.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.09))+.27*clamp(.03*_tri(drop_phase(_t,.07,244.,112.)+.27*lpnoise(_t,5148.)),-1.,1.)*exp(-24.07*_t)+0.*lpnoise(_t,1959.)*(1.-smstep(0.,.98,_t-.64))+.43*lpnoise(_t,8238.)*exp(-_t*25.54)+.11*lpnoise(_t,3803.)*exp(-_t*10.51))*smstep(0.,.006,_t));
                        amaydrumR = vel*(vel*(clamp(1.32*_tri(drop_phase(_t2,.06,308.,80.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.15))+.82*clamp(.49*_tri(drop_phase(_t2,.06,308.,80.))+.082*lpnoise(_t2,4595.),-1.,1.)*exp(-1.97*_t2)+.09*lpnoise(_t2,4032.)*(1.-smstep(0.,.97,_t2-.79))+.1*lpnoise(_t2,1111.)*exp(-_t2*12.69)+.16*lpnoise(_t2,7795.)*exp(-_t2*1.08))*smstep(0.,.003,_t2))
      +.5*((clamp(1.35*_tri(drop_phase(_t2,.07,244.,112.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.09))+.27*clamp(.03*_tri(drop_phase(_t2,.07,244.,112.)+.27*lpnoise(_t2,5148.)),-1.,1.)*exp(-24.07*_t2)+0.*lpnoise(_t2,1959.)*(1.-smstep(0.,.98,_t2-.64))+.43*lpnoise(_t2,8238.)*exp(-_t2*25.54)+.11*lpnoise(_t2,3803.)*exp(-_t2*10.51))*smstep(0.,.006,_t2));
                    }
                    else if(drum == 44){
                        amaydrumL = vel*(((clamp(1.42*_tri(drop_phase(_t,.02,261.,53.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.28))+.86*clamp(.04*_tri(drop_phase(_t,.02,261.,53.)+.86*lpnoise(_t,3210.)),-1.,1.)*exp(-20.77*_t)+.03*lpnoise(_t,2325.)*(1.-smstep(0.,.42,_t-.01))+.28*lpnoise(_t,4276.)*exp(-_t*14.57)+.72*lpnoise(_t,3219.)*exp(-_t*9.93))*smstep(0.,.007,_t)));
                        amaydrumR = vel*(((clamp(1.42*_tri(drop_phase(_t2,.02,261.,53.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.28))+.86*clamp(.04*_tri(drop_phase(_t2,.02,261.,53.)+.86*lpnoise(_t2,3210.)),-1.,1.)*exp(-20.77*_t2)+.03*lpnoise(_t2,2325.)*(1.-smstep(0.,.42,_t2-.01))+.28*lpnoise(_t2,4276.)*exp(-_t2*14.57)+.72*lpnoise(_t2,3219.)*exp(-_t2*9.93))*smstep(0.,.007,_t2)));
                    }
                    else if(drum == 45){
                        amaydrumL = vel*(((clamp(1.43*_tri(drop_phase(_t,.182,153.909,76.006)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.152))+1.428*clamp(.707*_tri(drop_phase(_t,.182,153.909,76.006)+1.428*lpnoise(_t,760.989)),-1.,1.)*exp(-8.556*_t)+.066*lpnoise(_t,13562.653)*(1.-smstep(0.,.24,_t-.088))+.724*lpnoise(_t,4127.819)*exp(-_t*3.662)+.295*lpnoise(_t,7269.681)*exp(-_t*2.313))*smstep(0.,.05,_t)));
                        amaydrumR = vel*(((clamp(1.43*_tri(drop_phase(_t,.182,153.909,76.006)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.152))+1.428*clamp(.707*_tri(drop_phase(_t,.182,153.909,76.006)+1.428*lpnoise(_t,760.989)),-1.,1.)*exp(-8.556*_t)+.066*lpnoise(_t,13562.653)*(1.-smstep(0.,.24,_t-.088))+.724*lpnoise(_t,4127.819)*exp(-_t*3.662)+.295*lpnoise(_t,7269.681)*exp(-_t*2.313))*smstep(0.,.05,_t)));
                    }
                    else if(drum == 46){
                        amaydrumL = vel*((.837*(.541*lpnoise(_t,2041.774)+.798*lpnoise(_t,8260.482)+.931*lpnoise(_t,8317.984))*(smstep(0.,.007,_t)-smstep(0.,.37,_t-.05))+_sin(drop_phase(_t,.033,464.443,270.029))*exp(-_t*32.249)*.841+_sin(drop_phase(_t*659.983,.033,464.443,270.029))*exp(-_t*33.)*.618));
                        amaydrumR = vel*((.837*(.541*lpnoise(_t,2041.774)+.798*lpnoise(_t,8260.482)+.931*lpnoise(_t,8317.984))*(smstep(0.,.007,_t)-smstep(0.,.37,_t-.05))+_sin(drop_phase(_t,.033,464.443,270.029))*exp(-_t*32.249)*.841+_sin(drop_phase(_t*659.983,.033,464.443,270.029))*exp(-_t*33.)*.618));
                    }
                    else if(drum == 48){
                        amaydrumL = vel*((clamp(2.27*_tri(drop_phase(_t,.03,241.,72.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.01))+.91*clamp(.9*_tri(drop_phase(_t,.03,241.,72.)+.91*lpnoise(_t,8164.)),-1.,1.)*exp(-20.76*_t)+.05*lpnoise(_t,10466.)*(1.-smstep(0.,.18,_t-.56))+.56*lpnoise(_t,7123.)*exp(-_t*5.45)+.11*lpnoise(_t,1134.)*exp(-_t*13.82))*smstep(0.,.004,_t));
                        amaydrumR = vel*((clamp(2.27*_tri(drop_phase(_t2,.03,241.,72.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.01))+.91*clamp(.9*_tri(drop_phase(_t2,.03,241.,72.)+.91*lpnoise(_t2,8164.)),-1.,1.)*exp(-20.76*_t2)+.05*lpnoise(_t2,10466.)*(1.-smstep(0.,.18,_t2-.56))+.56*lpnoise(_t2,7123.)*exp(-_t2*5.45)+.11*lpnoise(_t2,1134.)*exp(-_t2*13.82))*smstep(0.,.004,_t2));                        
env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),3.);
                    }
                    else if(drum == 49){
                        amaydrumL = vel*((clamp(.55*_tri(drop_phase(_t,.01,192.,54.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.09))+.8*clamp(.84*_tri(drop_phase(_t,.01,192.,54.)+.8*lpnoise(_t,5057.)),-1.,1.)*exp(-6.09*_t)+.05*lpnoise(_t,12188.)*(1.-smstep(0.,.27,_t-.56))+.89*lpnoise(_t,3778.)*exp(-_t*13.78)+.08*lpnoise(_t,5266.)*exp(-_t*15.79))*smstep(0.,.008,_t));
                        amaydrumR = vel*((clamp(.55*_tri(drop_phase(_t2,.01,192.,54.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.09))+.8*clamp(.84*_tri(drop_phase(_t2,.01,192.,54.)+.8*lpnoise(_t2,5057.)),-1.,1.)*exp(-6.09*_t2)+.05*lpnoise(_t2,12188.)*(1.-smstep(0.,.27,_t2-.56))+.89*lpnoise(_t2,3778.)*exp(-_t2*13.78)+.08*lpnoise(_t2,5266.)*exp(-_t2*15.79))*smstep(0.,.008,_t2));
                    }
                    else if(drum == 50){
                        amaydrumL = vel*.64*(clamp(2.7*_tri(drop_phase(_t,.07,279.,33.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t-.14))+2.*clamp(.29*_tri(drop_phase(_t,.07,279.,33.)+2.*lpnoise(_t,3537.)),-1.,1.)*exp(-26.74*_t)+.02*lpnoise(_t,1391.)*(1.-smstep(0.,.71,_t-.27))+0.*lpnoise(_t,8614.)*exp(-_t*3.08)+0.*lpnoise(_t,3743.)*exp(-_t*38.19))*smstep(0.,.006,_t);
                        amaydrumR = vel*.64*(clamp(2.7*_tri(drop_phase(_t2,.07,279.,33.)),-1.,1.)*(1.-smstep(-1e-3,0.,_t2-.14))+2.*clamp(.29*_tri(drop_phase(_t2,.07,279.,33.)+2.*lpnoise(_t2,3537.)),-1.,1.)*exp(-26.74*_t2)+.02*lpnoise(_t2,1391.)*(1.-smstep(0.,.71,_t2-.27))+0.*lpnoise(_t2,8614.)*exp(-_t2*3.08)+0.*lpnoise(_t2,3743.)*exp(-_t2*38.19))*smstep(0.,.006,_t2);
                    }
                    
                    if(drum > 0)
                    {
                        dL += amtL * s_moothmin(env * amaydrumL);
                        dR += amtR * s_moothmin(env * amaydrumR);
                    }
                }
                else
                {
                    f = freqC1(note_pitch(_note) + mod_transp(_mod));

                    if(abs(slide) > 1e-3) // THIS IS SLIDEY BIZ
                    {
                        float Bslide = trk_slide(trk);
                        float fac = slide * log(2.)/12.;
                        if (Bprog <= Bslide)
                        {
                            float help = 1. - Bprog/Bslide;
                            f *= Bslide * (fhelp(fac) - help * fhelp(fac*help*help)) / Bprog;
                        }
                        else
                        {
                            f *= 1. + (Bslide * (fhelp(fac)-1.)) / Bprog;
                        }
                    }

                    env = theta(Bprog) * (1. - smstep(Boff-rel, Boff, B));
                    if(syn == 0){amaysynL = _sin(f*_t); amaysynR = _sin(f*_t2);}
                    else if(syn == 10){
                        
                        amaysynL = .8*env_AHDSRexp(Bprog,L,.001,.3,.1,1.,.3)*(waveshape(clip(1.6*QFM((_t-0.0*(1.+2.*_sin(.15*_t))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8)
      +waveshape(clip(1.6*QFM((_t-2.0e-03*(1.+2.*_sin(.15*_t))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8)
      +waveshape(clip(1.6*QFM((_t-4.0e-03*(1.+2.*_sin(.15*_t))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8));
                        amaysynR = .8*env_AHDSRexp(Bprog,L,.001,.3,.1,1.,.3)*(waveshape(clip(1.6*QFM((_t2-0.0*(1.+2.*_sin(.15*_t2))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8)
      +waveshape(clip(1.6*QFM((_t2-2.0e-03*(1.+2.*_sin(.15*_t2))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8)
      +waveshape(clip(1.6*QFM((_t2-4.0e-03*(1.+2.*_sin(.15*_t2))),f,0.,.00787*127.*pow(vel,12.*7.87e-3),.00787*112.*pow(vel,63.*7.87e-3),.00787*127.*pow(vel,26.*7.87e-3),.00787*96.*pow(vel,120.*7.87e-3),.5,1.,1.5,1.,.00787*0.,.00787*0.,.00787*0.,.00787*50.,8.)),.3,.2,.8,.4,.8,.8));
                    }
                    else if(syn == 22){
                        
                        amaysynL = exp(-11.*Bprog)*env_AHDSRexp(Bprog,L,.01,0.,.1+.5*vel,.01,.4)*sinshape(clip((1.+exp(-11.*Bprog))*_tri(f*_t+.2*env_AHDSRexp(Bprog,L,.5,1.,.1,1.,.1)*clip((1.+3.)*_sq_(1.99*f*_t,.3+2.*vel+.2*(2.*fract(3.97*f*_t)-1.)))+.2*vel*env_AHDSRexp(Bprog,L,.325,1.,.1,1.,.3)*(2.*fract(3.97*f*_t)-1.))),.01*aux*exp(-11.*Bprog),5.)
      +.2*env_AHDSRexp(Bprog,L,.001,0.,.05,0.,.8)*lpnoise(_t + 0.,6000.+200.*note_pitch(_note))
      +.4*exp(-11.*Bprog)*env_AHDSRexp(Bprog,L,.325,1.,.1,1.,.3)*clip((1.+3.)*_sq_(1.99*f*_t,.3+2.*vel+.2*(2.*fract(3.97*f*_t)-1.)))*env_AHDSRexp(Bprog,L,.001,0.,.2+.2*vel,.01,.4);
                        amaysynR = exp(-11.*Bprog)*env_AHDSRexp(Bprog,L,.01,0.,.1+.5*vel,.01,.4)*sinshape(clip((1.+exp(-11.*Bprog))*_tri(f*_t2+.2*env_AHDSRexp(Bprog,L,.5,1.,.1,1.,.1)*clip((1.+3.)*_sq_(1.99*f*_t2,.3+2.*vel+.2*(2.*fract(3.97*f*_t2)-1.)))+.2*vel*env_AHDSRexp(Bprog,L,.325,1.,.1,1.,.3)*(2.*fract(3.97*f*_t2)-1.))),.01*aux*exp(-11.*Bprog),5.)
      +.2*env_AHDSRexp(Bprog,L,.001,0.,.05,0.,.8)*lpnoise(_t2 + 0.,6000.+200.*note_pitch(_note))
      +.4*exp(-11.*Bprog)*env_AHDSRexp(Bprog,L,.325,1.,.1,1.,.3)*clip((1.+3.)*_sq_(1.99*f*_t2,.3+2.*vel+.2*(2.*fract(3.97*f*_t2)-1.)))*env_AHDSRexp(Bprog,L,.001,0.,.2+.2*vel,.01,.4);
                        env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),6.);
                    }
                    else if(syn == 109){
                        time2 = time-.1; _t2 = _t-.1;
                        amaysynL = pluck7short_vol(BT)*((vel*sinshape(QFM(_t,f,0.,.00787*125.,.00787*env_AHDSR(Bprog,L,.0001,.047,.01,.404,0.)*20.,.00787*env_AHDSR(Bprog,L,.0001,.151,.071,.069,0.)*110.,.00787*env_AHDSR(Bprog,L,.0001,.232,.08,.003,0.)*65.,.999,1.,1.+.0799*(.5+(.5*_sin(.18*Bprog))),2.,.00787*109.,.00787*21.,.00787*94.,.00787*0.,11.),.03*aux,3.)*env_AHDSR(Bprog,L,.0001,.03,.167,.796,.114))+_sq_(.501*f*_t,.4+.3*(.5+(.5*_sin(.8*Bprog))))+.6*clip((1.+.2*aux)*_sin(.25*f*_t)));
                        amaysynR = pluck7short_vol(BT)*((vel*sinshape(QFM(_t2,f,0.,.00787*125.,.00787*env_AHDSR(Bprog,L,.0001,.047,.01,.404,0.)*20.,.00787*env_AHDSR(Bprog,L,.0001,.151,.071,.069,0.)*110.,.00787*env_AHDSR(Bprog,L,.0001,.232,.08,.003,0.)*65.,.999,1.,1.+.0799*(.5+(.5*_sin(.18*Bprog))),2.,.00787*109.,.00787*21.,.00787*94.,.00787*0.,11.),.03*aux,3.)*env_AHDSR(Bprog,L,.0001,.03,.167,.796,.114))+_sq_(.501*f*_t2,.4+.3*(.5+(.5*_sin(.8*Bprog))))+.6*clip((1.+.2*aux)*_sin(.25*f*_t2)));
                    }
                    else if(syn == 119){
                        time2 = time-0.02; _t2 = _t-0.02;
                        amaysynL = (MADD(_t,f,0.,12,1,.92,2513.*env_AHDSRexp(Bprog,L,.31,0.,.1,1.,0.3),65.1,1.,3.,.008,.25,0.,1)*env_AHDSRexp(Bprog,L,.145+aux,.13,.38,.27,0.3));
                        amaysynR = (MADD(_t2,f,0.,12,1,.92,2513.*env_AHDSRexp(Bprog,L,.31,0.,.1,1.,0.3),65.1,1.,3.,.008,.25,0.,1)*env_AHDSRexp(Bprog,L,.145+aux,.13,.38,.27,0.3));
                        env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),4.);
                    }
                    else if(syn == 133){
                        
                        amaysynL = ((QFM((_t),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.)+QFM((_t-4.0e-03*(1.+3.*_sin(.1*_t))),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.)+QFM((_t-8.0e-03*(1.+3.*_sin(.1*_t))),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.))*env_AHDSRexp(Bprog,L,.001,.034,.148,.677,.094));
                        amaysynR = ((QFM((_t2),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.)+QFM((_t2-4.0e-03*(1.+3.*_sin(.1*_t2))),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.)+QFM((_t2-8.0e-03*(1.+3.*_sin(.1*_t2))),f,0.,.00787*110.,.00787*env_AHDSRexp(Bprog,L,.195,.003,.035,.383,0.)*78.,.00787*env_AHDSRexp(Bprog,L,.144,.062,.01,.425,0.)*47.,.00787*env_AHDSRexp(Bprog,L,.003,.018,.18,.126,0.)*70.,.5,1.,1.001,1.,.00787*118.,.00787*10.,.00787*103.,.00787*83.,5.))*env_AHDSRexp(Bprog,L,.001,.034,.148,.677,.094));
                        env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),6.);
                    }
                    else if(syn == 135){
                        time2 = time-.5; _t2 = _t-.5;
                        amaysynL = .4*env_AHDSRexp(Bprog,L,.02,0.,.01,.9,.01)*(_sin(.5*f*floor(24333.*(_t-0.0*(1.+8.5*_sin(.2*_t)))+.5)/24333.)+_sin(.499*f*floor(13400.*(_t-0.0*(1.+8.5*_sin(.2*_t)))+.5)/13400.)
      +_sin(.5*f*floor(24333.*(_t-1.0e-03*(1.+8.5*_sin(.2*_t)))+.5)/24333.)+_sin(.499*f*floor(13400.*(_t-1.0e-03*(1.+8.5*_sin(.2*_t)))+.5)/13400.))*SUBvol(BT);
                        amaysynR = .4*env_AHDSRexp(Bprog,L,.02,0.,.01,.9,.01)*(_sin(.5*f*floor(24333.*(_t2-0.0*(1.+8.5*_sin(.2*_t2)))+.5)/24333.)+_sin(.499*f*floor(13400.*(_t2-0.0*(1.+8.5*_sin(.2*_t2)))+.5)/13400.)
      +_sin(.5*f*floor(24333.*(_t2-1.0e-03*(1.+8.5*_sin(.2*_t2)))+.5)/24333.)+_sin(.499*f*floor(13400.*(_t2-1.0e-03*(1.+8.5*_sin(.2*_t2)))+.5)/13400.))*SUBvol(BT);
                        env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),5.);
                    }
                    else if(syn == 137){
                        time2 = time-.005; _t2 = _t-.005;
                        amaysynL = sfqm_vol(BT)*env_AHDSRexp(Bprog,L,.02,0.,.01,.75,.001)*s_atan(s_atan(5.*QFM(_t,f,0.,.00787*127.,.00787*50.*env_AHDSRexp(Bprog,L,.185,0.,.1,1.,.001),.00787*60.,.00787*0.,.25+.25*.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.5+.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.4999,1.,.00787*-255.,.00787*0.,.00787*0.,.00787*0.,9.))+s_atan(5.*QFM(_t,f,0.,.00787*127.,.00787*50.*env_AHDSRexp(Bprog,L,.185,0.,.1,1.,.001),.00787*60.,.00787*0.,.25+.25*.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.5+.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.4999,1.,.00787*-255.,.00787*0.,.00787*0.,.00787*0.,9.)));
                        amaysynR = sfqm_vol(BT)*env_AHDSRexp(Bprog,L,.02,0.,.01,.75,.001)*s_atan(s_atan(5.*QFM(_t2,f,0.,.00787*127.,.00787*50.*env_AHDSRexp(Bprog,L,.185,0.,.1,1.,.001),.00787*60.,.00787*0.,.25+.25*.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.5+.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.4999,1.,.00787*-255.,.00787*0.,.00787*0.,.00787*0.,9.))+s_atan(5.*QFM(_t2,f,0.,.00787*127.,.00787*50.*env_AHDSRexp(Bprog,L,.185,0.,.1,1.,.001),.00787*60.,.00787*0.,.25+.25*.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.5+.04*env_AHDSRexp(Bprog,L,.225,0.,.1,1.,.001)*(.5+(.001*_sin(1.*Bprog))),.4999,1.,.00787*-255.,.00787*0.,.00787*0.,.00787*0.,9.)));
                        env = theta(Bprog)*pow(1.-smstep(Boff-rel, Boff, B),3.);
                    }
                    else if(syn == 138){
                        
                        amaysynL = maceboss_vol(BT)*(env_AHDSR(Bprog,L,.007,0.,.01,1.,.01)*(sinshape(MADD(_t,.5*f,0.,256,2,1.+.9*(.55+(.4*clip((1.+1.)*_sin(4.*BT)))),(1088.+(863.*_sin_(2.*BT,.4))),10.,5.37,3.85,.005,.4*(.55+(.4*clip((1.+1.)*_sin(4.*BT)))),0.,0.),1.,3.)+.8*clip((1.+.5)*_sin(.499*f*_t))+.4*_sq_(1.01*f*_t,.95)));
                        amaysynR = maceboss_vol(BT)*(env_AHDSR(Bprog,L,.007,0.,.01,1.,.01)*(sinshape(MADD(_t2,.5*f,0.,256,2,1.+.9*(.55+(.4*clip((1.+1.)*_sin(4.*BT)))),(1088.+(863.*_sin_(2.*BT,.4))),10.,5.37,3.85,.005,.4*(.55+(.4*clip((1.+1.)*_sin(4.*BT)))),0.,0.),1.,3.)+.8*clip((1.+.5)*_sin(.499*f*_t2))+.4*_sq_(1.01*f*_t2,.95)));
                    }
                    
                    sL += amtL * trk_norm(trk) * s_moothmin(clamp(env,0.,1.) * amaysynL);
                    sR += amtR * trk_norm(trk) * s_moothmin(clamp(env,0.,1.) * amaysynR);
                }
            }
            
        }
    }
    float masterL = .08 * sidechain * sL + .4 * dL;
    float masterR = .08 * sidechain * sR + .4 * dR;
    return vec2(
        masterL,
        masterR);
}

void main()
{
    Tsample = 1./iSampleRate;
    float t = (iBlockOffset + gl_FragCoord.x + gl_FragCoord.y*iTexSize) * Tsample;
    vec2 s = mainSynth(t);
    vec2 v  = floor((0.5+0.5*s)*65535.0);
    vec2 vl = mod(v,256.0)/255.0;
    vec2 vh = floor(v/256.0)/255.0;
    gl_FragColor = vec4(vl.x,vh.x,vl.y,vh.y);
}
