/* Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
 * Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
#version 130

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iScale;
uniform float iNBeats;

        
    const vec3 c = vec3(1.,0.,-1.);
    

     // nr4 advice: hardcode replace these
    #define PIXEL .005
    #define CONTOUR .01
    #define DARKBORDER 0.1
    #define DARKENING col*col*col

    void rand(in vec2 x, out float n);
    void lpnoise(in float t, in float fq, out float n);
    void lp2dnoise(in float t, out vec2 n);
    void dboxcombo(in vec2 x, in vec2 b, in float distort, inout float d);
    void rot(in float phi, out mat2 m);
    float sm(in float d, in float blur)
    {
        return smoothstep(.2/iResolution.y, -.2/iResolution.y, blur*d);
    }
    void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
    
void glyph_undefined(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
        void glyph_0(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_1(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_2(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_3(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_4(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_5(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_6(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_7(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_8(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_9(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_n(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_o(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_lelzeichen(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_e(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_N_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_q(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_u(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_a(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Q_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_K_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_F_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_D_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_C_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_B_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_A_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_G_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_H_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_I_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_J_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_L_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_M_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_X_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_W_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_V_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_U_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_R_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_kot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_S_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_E_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_O_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_P_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_T_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Z_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_minus(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_colon(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_ampersand(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_m(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_questschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_x(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_t(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_eggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_w(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_y(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_l(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_b(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_j(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_p(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_i(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_c(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_s(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_z(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_r(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_f(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_h(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_d(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_g(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Y_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_hashtag(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_slushy(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);

    void phrase_QMlelzeichenslushylelzeichenNR4lelzeichenslushylelzeichenATLAS(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_Q_big(uv,shift+vec2(-80.5*spac,-9.),phi,scale,distort,d);
    glyph_M_big(uv,shift+vec2(-68.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-50.5*spac,-9.),phi,scale,distort,d);
    glyph_slushy(uv,shift+vec2(-44.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-39.5*spac,-9.),phi,scale,distort,d);
    glyph_N_big(uv,shift+vec2(-31.5*spac,-9.),phi,scale,distort,d);
    glyph_R_big(uv,shift+vec2(-19.5*spac,-9.),phi,scale,distort,d);
    glyph_4(uv,shift+vec2(-7.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(4.5*spac,-9.),phi,scale,distort,d);
    glyph_slushy(uv,shift+vec2(10.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(15.5*spac,-9.),phi,scale,distort,d);
    glyph_A_big(uv,shift+vec2(23.5*spac,-9.),phi,scale,distort,d);
    glyph_T_big(uv,shift+vec2(34.5*spac,-9.),phi,scale,distort,d);
    //glyph_L_big(uv,shift+vec2(44.5*spac,-9.),phi,scale,distort,d);
    glyph_A_big(uv,shift+vec2(56.5*spac,-9.),phi,scale,distort,d);
    // glyph_S_big(uv,shift+vec2(68.5*spac,-9.),phi,scale,distort,d);
            }void phrase_Team210(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_T_big(uv,shift+vec2(-36.5*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-28.5*spac,-8.),phi,scale,distort,d);
    glyph_a(uv,shift+vec2(-18.5*spac,-10.),phi,scale,distort,d);
    glyph_m(uv,shift+vec2(-7.5*spac,-9.),phi,scale,distort,d);
    glyph_2(uv,shift+vec2(4.5*spac,-9.),phi,scale,distort,d);
    glyph_1(uv,shift+vec2(14.5*spac,-9.),phi,scale,distort,d);
    glyph_0(uv,shift+vec2(24.5*spac,-8.),phi,scale,distort,d);
            }
            void phrase_wwwdotnovoquedoteu(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_w(uv,shift+vec2(-81.*spac,-9.),phi,scale,distort,d);
    glyph_w(uv,shift+vec2(-65.*spac,-9.),phi,scale,distort,d);
    glyph_w(uv,shift+vec2(-49.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(-33.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-27.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-15.*spac,-9.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(-3.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(9.*spac,-9.),phi,scale,distort,d);
    glyph_q(uv,shift+vec2(21.*spac,-9.),phi,scale,distort,d);
    glyph_u(uv,shift+vec2(33.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(44.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(54.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(60.*spac,-9.),phi,scale,distort,d);
    glyph_u(uv,shift+vec2(70.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_nolelzeichenevokedot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_n(uv,shift+vec2(-46.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-34.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-22.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-14.*spac,-9.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(-4.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(8.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(20.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(30.*spac,-8.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(40.*spac,-9.),phi,scale,distort,d);
            }
            void phrase_NOVOQUE(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
            {
                d = 1.;
                glyph_N_big(uv,shift+vec2(-42.*spac,-9.),phi,scale,distort,d);
        glyph_O_big(uv,shift+vec2(-30.*spac,-9.),phi,scale,distort,d);
        glyph_V_big(uv,shift+vec2(-18.*spac,-9.),phi,scale,distort,d);
        glyph_O_big(uv,shift+vec2(-7.*spac,-10.),phi,scale,distort,d);
        glyph_Q_big(uv,shift+vec2(6.*spac,-9.),phi,scale,distort,d);
        glyph_U_big(uv,shift+vec2(18.*spac,-9.),phi,scale,distort,d);
        glyph_E_big(uv,shift+vec2(30.*spac,-9.),phi,scale,distort,d);
            }
void trigger_NOVOQUE(in vec2 uv, in float t, in float start_t, inout vec3 col) {
        vec2 rndshift;
        lp2dnoise(3.*t, rndshift);
        rndshift *= .7;
        float dst = .93;
        t -= start_t;
        if (t < 0. || t > 2.) // after 2sec. it should be over, if not, extend this
        {
            return;
        }
        float stutter = (t < 0.2) ? round(fract(100.*t)) : 1.;
        float scale = 1. + t * 3.;	
        float alpha = exp(-4.*t)*stutter;
        float spac = 1.-.2*t;

//        col = mix(col, c.yyy, .3*exp(-10.*t)); // drop
		float d;
        phrase_NOVOQUE(uv,-rndshift,0.,scale,dst,spac,d);
        col = mix(col, mix(col*col*col, c.yyy, .3), alpha*sm(d-CONTOUR, 1.));
        col = mix(col, c.xxx, alpha * sm(d-.0005, 1.));        
        phrase_NOVOQUE(uv,rndshift,0.,scale,dst,spac,d);
        col = mix(col, mix(col*col*col, c.yyy, .3), alpha*sm(d-CONTOUR, 1.));
        col = mix(col, c.xxx, alpha * sm(d-.0005, 1.));            
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        
        vec2 uv = (fragCoord.xy-.5*iResolution.xy)/iResolution.y; // qm hack
        
        vec3 bgcol = texture(iChannel0, fragCoord.xy/iResolution.xy).rgb;
        vec3 col = bgcol;
        float d;
        float alpha = 1.;
        float blur = 1.;
        float t = iTime-24.;
        
        trigger_NOVOQUE(uv, t, 0., col);
        if(t>=0. && t<10.)
        {
            // phrase_QMlelzeichenslushylelzeichenNR4lelzeichenslushylelzeichenATLAS(uv,vec2(0.,-20.),0.,.9,1.,1.,d);
            // col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
            // col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            phrase_Team210(uv,vec2(0.,0.),0.,1.3,1.,1.,d);
            col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
            col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            alpha = .8;
            blur = .02;
            phrase_Team210(uv,vec2(0.,0.),0.,1.3,.8,1.,d);
            col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            // phrase_QMlelzeichenslushylelzeichenNR4lelzeichenslushylelzeichenATLAS(uv,vec2(0.,-20.),0.,.9,1.,1.,d);
            // col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            
            uv -= 10.*(vec2(.3,.1)*fract(.02*t+.56*t*t) - vec2(0.,.05));
            float breite = 50. * exp(-.2*t);
            float spot_int = exp(-breite*(.5*uv.x*uv.y+8.*uv.y*uv.y));
            col = mix(bgcol, col, spot_int);
        }
        float start_t = 0.;
		float stop_t = 3.;
        t = t-10.;
        
        if((t >= start_t && t < stop_t) || t >= 9.)
        {
        float scale = .95;
        float dst = 1.;
        vec2 rndshift;
        lp2dnoise(12.*t, rndshift);
        float stutter = (fract(t - start_t) < 0.2) ? round(fract(100.*t)) : 1.;
        float decay = 1. - (t - start_t < .5 ? fract(t*2.) : exp(-(t-start_t)));
            alpha *= decay*stutter;
            uv -= vec2(0,.1);
        	phrase_nolelzeichenevokedot(uv,vec2(0.,0.),0.,scale,dst,1.,d);
        	col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            phrase_nolelzeichenevokedot(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
	        col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv -= vec2(0,-.2);            
        	phrase_wwwdotnovoquedoteu(uv,vec2(0.,0.),0.,scale,dst,1.,d);
        	col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            phrase_wwwdotnovoquedoteu(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
	        col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv -= vec2(0,.1);
        }

        fragColor = vec4(clamp(mix(col,bgcol, .5),0.,1.),1.); // qm hack fragColor -> fragColor
    }
    

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
