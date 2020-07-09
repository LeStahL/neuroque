uniform float iTime;
uniform vec2 iResolution;

const float pi = acos(-1.);
const vec3 c = vec3(1.,0.,-1.);

void rand(in vec2 x, out float n);
void lfnoise(in vec2 t, out float n);
void mfnoise(in vec2 x, in float d, in float b, in float e, out float n);
float dist2(vec2 p0,vec2 p1,vec2 p2,vec2 x,float t);
void dspline2(in vec2 x, in vec2 p0, in vec2 p1, in vec2 p2, out float ds);
void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d);

const int npts1 = 320;
const float path1[npts1] = float[npts1](0.435,0.048,0.435,0.081,0.145,0.016,0.145,0.048,0.371,-0.048,0.371,0.113,0.371,0.113,0.387,0.145,0.387,0.145,0.484,0.145,0.484,0.145,0.500,0.113,0.500,0.113,0.500,0.048,0.500,0.048,0.484,0.016,0.484,0.016,0.500,-0.016,0.500,-0.016,0.500,-0.048,0.500,-0.048,0.484,-0.081,0.484,-0.081,0.387,-0.081,0.387,-0.081,0.371,-0.048,0.081,0.113,0.097,0.145,0.097,0.145,0.194,0.145,0.194,0.145,0.210,0.113,0.210,0.113,0.210,-0.113,0.210,-0.113,0.194,-0.145,0.194,-0.145,0.161,-0.145,0.161,-0.145,0.145,-0.113,0.145,-0.113,0.145,-0.081,0.145,-0.081,0.097,-0.081,0.097,-0.081,0.081,-0.048,0.081,-0.048,0.081,0.113,0.000,0.016,0.000,0.048,-0.048,-0.081,-0.065,-0.048,-0.065,-0.048,-0.065,0.113,-0.065,0.113,-0.048,0.145,-0.048,0.145,0.048,0.145,0.048,0.145,0.065,0.113,0.065,0.113,0.065,-0.048,0.065,-0.048,0.048,-0.081,0.048,-0.081,-0.048,-0.081,-0.145,0.113,-0.145,0.081,-0.210,0.113,-0.194,0.145,-0.194,0.145,-0.161,0.145,-0.161,0.145,-0.145,0.113,-0.145,0.113,-0.129,0.145,-0.129,0.145,-0.097,0.145,-0.097,0.145,-0.081,0.113,-0.081,0.113,-0.081,-0.016,-0.081,-0.016,-0.113,-0.081,-0.113,-0.081,-0.177,-0.081,-0.177,-0.081,-0.210,-0.016,-0.210,-0.016,-0.210,0.113,-0.290,0.048,-0.290,0.016,-0.355,-0.048,-0.355,0.113,-0.355,0.113,-0.339,0.145,-0.339,0.145,-0.242,0.145,-0.242,0.145,-0.226,0.113,-0.226,0.113,-0.226,-0.048,-0.226,-0.048,-0.242,-0.081,-0.242,-0.081,-0.339,-0.081,-0.339,-0.081,-0.355,-0.048,-0.484,-0.081,-0.500,-0.048,-0.500,-0.048,-0.500,0.113,-0.500,0.113,-0.484,0.145,-0.484,0.145,-0.452,0.145,-0.452,0.145,-0.435,0.113,-0.435,0.113,-0.435,0.145,-0.435,0.145,-0.387,0.145,-0.387,0.145,-0.371,0.113,-0.371,0.113,-0.371,-0.048,-0.371,-0.048,-0.387,-0.081,-0.387,-0.081,-0.419,-0.081,-0.419,-0.081,-0.435,-0.048,-0.435,-0.048,-0.435,-0.081,-0.435,-0.081,-0.484,-0.081,0.290,0.113,0.290,0.032,0.226,0.113,0.242,0.145,0.242,0.145,0.274,0.145,0.274,0.145,0.290,0.113,0.290,0.113,0.306,0.145,0.306,0.145,0.339,0.145,0.339,0.145,0.355,0.113,0.355,0.113,0.355,-0.048,0.355,-0.048,0.339,-0.081,0.339,-0.081,0.242,-0.081,0.242,-0.081,0.226,-0.048,0.226,-0.048,0.226,0.113);

void dnovoque(in vec2 x, out float ret)
{
    ret = 1.;
    float da;

    float n = 0.;
    for(int i=0; i<npts1/4; ++i)
    {
        vec2 ptsi = vec2(path1[4*i], path1[4*i+1]),
            ptsip1 = vec2(path1[4*i+2], path1[4*i+3]),
            k = x-ptsi, 
            d = ptsip1-ptsi;
        
        float beta = k.x/d.x,
            alpha = d.y*k.x/d.x-k.y;
        
        n += step(.0, beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, ptsi, ptsip1, da);
        ret = min(ret, da);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
}


void dbox3(in vec3 x, in vec3 b, out float d);
void dbox210(in vec3 x, in float size, out vec2 sdf);
void dbox210_plane(in vec2 uv, in float size, out float d)
{
    vec2 sdf;
    dbox210(vec3((uv-.5*size*c.xy).yx, 0.15), size, sdf);
    d = sdf.x;
    dbox210(vec3(.15, uv*c.xz), size, sdf);
    d = min(d,sdf.x);
    dbox210(vec3(.15, (uv+.5*size*c.xy).yx).yxz, size, sdf);
    d = min(d,sdf.x);
}

void spline_ifs(in vec2 uv, in float i, out float d)
{
    vec2 p0, p1, p2;
    lfnoise(uv-iTime+i,p0.x);
    lfnoise(uv+1337.-iTime+i,p0.y);
    mfnoise(uv+2337.-iTime+i, 1., 100., .45,p1.x);
    mfnoise(uv+3337.-iTime+i, 1., 100., .45,p1.y);

    // lfnoise(uv+4337.-iTime+i,p2.x);
    // lfnoise(uv+5337.-iTime+i,p2.y);
    vec2 a = vec2(iResolution.x/iResolution.y,1.);
    // dspline2(uv*a, p0, p1, p2, d);
    dlinesegment(uv*a.yx, p0, p1, d);

    float da = abs(length(uv-p0)-.005)-.001;
    d = mix(d, min(d,da), clamp(iTime-26.454, 0., 1.)/.5);
    da = abs(length(uv-p1)-.005)-.001;
    d = mix(d, min(d,da), clamp(iTime-26.454, 0., 1.)/.5);

    if(iTime < 12.688)
    {
	    dbox210_plane(uv, 1., da);
        d = mix(d, da, mix(.97,0.,clamp(iTime-18.733,0.,1.)/.5));
    }
    else if(iTime < 18.733+.5)
    {
        dnovoque(.7*uv, da);
        da /= .7;
        da = abs(da)-.02;
        d = mix(d, da, mix(.97,0.,clamp(iTime-18.733,0.,1.)/.5));
    }
}

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    if(iTime < 3.367-.25) 
    {
        fragColor = c.yyyx;
        return;
    }
    
    vec2 uv = (fragCoord.xy-.5*iResolution.xy)/iResolution.y;
    vec3 col = c.yyy;
    float d;
    vec3 c1 = mix(.7,1., clamp(iTime-18.733,0.,45.337-18.733)/(45.337-18.733))*mix(vec3(0.18,0.16,0.15), vec3(0.11,0.09,0.18), clamp(iTime-7.661, 0., 1.)*(1.-clamp(iTime-14.185,0.,1.))/.5),
        c2 = mix(.7,1.2, clamp(iTime-18.733,0.,45.337-18.733)/(45.337-18.733))*mix(vec3(0.91,0.30,0.24), vec3(0.21,0.30,0.94), clamp(iTime-7.661,0.,1.)*(1.-clamp(iTime-14.185,0.,1.))/.5);
    for(float i=0.; i<mix(mix(200.,100., step(12.688,iTime)),200.,step(18.733+.5, iTime)); i+=1.)
    {
        float f, f0;
        lfnoise(6.*uv+.01*i*c.xx-2.3*iTime, f);
        
        f = f*.1;//+uv.x*2.;
        f = mix(0., f, clamp(1.-i/1000.,0.,1.));
        mat2 R = mat2(cos(f), sin(f), -sin(f), cos(f));
        spline_ifs(R*(uv-.0002*i),.01*i,d);
        mfnoise(i*c.xx-f-iTime, 3.,1000., .25, f0);
        f0 = mix(0., f0, clamp(1.-i/1000.,0.,1.));
	    col = mix(col, mix(c1, c2,.5-.5*f), mix(f*mix(.01,.02,.5+.5*f-f0)*sm((abs(d)-.0005)/16./(15.5+.5*f)), sm((abs(d)-.0005)/mix(1.,10., clamp(iTime-18.733,0.,45.337-18.733)/(45.337-18.733))), mix(.06,.09,clamp(iTime-16.160,0.,1.)/.5)));
	    col = mix(col, mix(2.*c1, 2.*c2, .5+.5*f), mix(abs(f)*.2*sm((abs(abs(d)-.0005)-.0001)/2./(15.5+.5*f)), sm(abs(d-.0005)-.0002), mix(.06,.09,clamp(iTime-16.160,0.,1.)/.5)));
    }
    col = 2.*col + 2.*col * col + 3.* col * col * col;

    float da;
    if(iTime < 12.688)
	    dbox210_plane(uv, 1., da);
    else //if(iTime < 18.733+.5)
    {
        dnovoque(.7*uv, da);
        da /= .7;
        da = abs(da)-.02;
    }
    // d = mix(d, da, clamp(1.-i/100.,0.,1.));
    col = mix(col, .6*mix(col, length(col)/sqrt(3.)*c.xxx, .5), sm(da));
// *(1.-clamp(iTime-12.688+.5,0.,1.))*clamp(iTime-12.688-.5,0.,1.)

    col = mix(c.yyy, col, (
        clamp(iTime-3.367+.25, 0., 1.)
        -clamp(iTime-12.688+1.,0.,1.)
        +clamp(iTime-12.688,0.,1.)
        -clamp(iTime-49.825+.5,0.,1.)
    )/.5);

    fragColor = vec4(clamp(col,0.,1.),1.0);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}