#version 130

uniform vec2 iResolution;
uniform float iTime;


uniform float iFader0;
uniform float iFader1;
uniform float iFader2;
uniform float iFader3;
uniform float iFader4;
uniform float iFader5;
uniform float iFader6;
uniform float iFader7;

out vec4 gl_FragColor;

const vec3 c = vec3(1.,0.,-1.);
const float pi = acos(-1.);
const float ssize = 12.;

float iScale, nBeats;
void scale(in float time, out float s);
void nbeats(in float time, out float n);

const int npts = 336;
const float path[npts] = float[npts](0.449,-0.013,0.448,-0.053,0.448,-0.053,0.495,-0.048,0.495,-0.048,0.500,0.001,0.500,0.001,0.449,-0.013,0.338,-0.029,0.315,-0.025,0.315,-0.025,0.328,-0.079,0.328,-0.079,0.371,-0.061,0.371,-0.061,0.360,-0.029,0.360,-0.029,0.379,-0.053,0.379,-0.053,0.434,-0.054,0.434,-0.054,0.428,0.008,0.428,0.008,0.441,0.003,0.441,0.003,0.479,0.048,0.479,0.048,0.384,0.073,0.384,0.073,0.385,0.035,0.385,0.035,0.377,0.085,0.377,0.085,0.298,0.087,0.298,0.087,0.338,-0.029,0.225,0.022,0.228,0.007,0.228,0.007,0.270,0.001,0.270,0.001,0.225,0.022,0.180,0.114,0.288,0.082,0.288,0.082,0.329,-0.007,0.329,-0.007,0.253,-0.091,0.253,-0.091,0.182,-0.062,0.182,-0.062,0.167,0.071,0.167,0.071,0.180,0.114,0.125,-0.011,0.095,-0.086,0.095,-0.086,0.181,-0.130,0.181,-0.130,0.159,0.133,0.159,0.133,0.133,0.145,0.133,0.145,0.135,-0.022,0.135,-0.022,0.125,-0.011,0.124,0.116,0.133,0.003,0.133,0.003,0.079,0.028,0.079,0.028,0.113,-0.002,0.113,-0.002,0.101,-0.067,0.101,-0.067,-0.024,-0.145,-0.024,-0.145,-0.022,-0.011,-0.022,-0.011,0.028,-0.024,0.028,-0.024,-0.018,-0.001,-0.018,-0.001,0.002,0.080,0.002,0.080,0.124,0.116,-0.097,-0.099,-0.041,0.071,-0.041,0.071,-0.058,0.071,-0.058,0.071,-0.054,0.126,-0.054,0.126,-0.006,0.111,-0.006,0.111,-0.035,-0.139,-0.035,-0.139,-0.097,-0.099,-0.221,0.091,-0.201,-0.015,-0.201,-0.015,-0.182,-0.002,-0.182,-0.002,-0.190,-0.129,-0.190,-0.129,-0.090,-0.067,-0.090,-0.067,-0.043,0.067,-0.043,0.067,-0.123,0.066,-0.123,0.066,-0.136,-0.050,-0.136,-0.050,-0.130,0.095,-0.130,0.095,-0.221,0.091,-0.282,-0.017,-0.286,-0.007,-0.286,-0.007,-0.258,0.011,-0.258,0.011,-0.282,-0.017,-0.429,-0.002,-0.427,-0.008,-0.427,-0.008,-0.398,0.012,-0.398,0.012,-0.429,-0.002,-0.213,-0.129,-0.184,-0.014,-0.184,-0.014,-0.233,-0.022,-0.233,-0.022,-0.211,-0.008,-0.211,-0.008,-0.219,0.077,-0.219,0.077,-0.347,0.038,-0.347,0.038,-0.321,-0.066,-0.321,-0.066,-0.290,-0.076,-0.290,-0.076,-0.213,-0.129,-0.413,-0.075,-0.415,-0.054,-0.415,-0.054,-0.402,-0.074,-0.402,-0.074,-0.305,-0.116,-0.305,-0.116,-0.341,-0.013,-0.341,-0.013,-0.372,-0.026,-0.372,-0.026,-0.345,-0.006,-0.345,-0.006,-0.349,0.057,-0.349,0.057,-0.500,0.018,-0.500,0.018,-0.485,-0.026,-0.485,-0.026,-0.476,-0.022,-0.476,-0.022,-0.462,-0.067,-0.462,-0.067,-0.413,-0.075);

void rand(in vec2 x, out float n)
{
    x += 400.;
    n = fract(sin(dot(sign(x)*abs(x) ,vec2(12.9898,78.233)))*43758.5453);
}

void lfnoise(in vec2 t, out float n)
{
    vec2 i = floor(t);
    t = fract(t);
    t = smoothstep(c.yy, c.xx, t);
    vec2 v1, v2;
    rand(i, v1.x);
    rand(i+c.xy, v1.y);
    rand(i+c.yx, v2.x);
    rand(i+c.xx, v2.y);
    v1 = c.zz+2.*mix(v1, v2, t.y);
    n = mix(v1.x, v1.y, t.x);
}

void mfnoise(in vec2 x, in float d, in float b, in float e, out float n)
{
    n = 0.;
    float a = 1., nf = 0., buf;
    for(float f = d; f<b; f *= 2.)
    {
        lfnoise(f*x, buf);
        n += a*buf;
        a *= e;
        nf += 1.;
    }
    n *= (1.-e)/(1.-pow(e, nf));
}

// iq's smooth minimum
void smoothmin(in float a, in float b, in float k, out float dst)
{
    float h = max( k-abs(a-b), 0.0 )/k;
    dst = min( a, b ) - h*h*h*k*(1.0/6.0);
}

void dsmoothvoronoi(in vec2 x, in float sm, out float d, out vec2 z)
{
    float n;
//     lfnoise(x-iTime*c.xy, n);
    
    vec2 y = floor(x);
       float ret = 1.;
    vec2 pf=c.yy, p;
    float df=10.;
    
    for(int i=-1; i<=1; i+=1)
        for(int j=-1; j<=1; j+=1)
        {
            p = y + vec2(float(i), float(j));
            float pa;
            rand(p, pa);
            p += pa;
            
            d = length(x-p);
            
            if(d < df)
            {
                df = d;
                pf = p;
            }
        }
    for(int i=-1; i<=1; i+=1)
        for(int j=-1; j<=1; j+=1)
        {
            p = y + vec2(float(i), float(j));
            float pa;
            rand(p, pa);
            p += pa;
            
            vec2 o = p - pf;
            d = length(.5*o-dot(x-pf, o)/dot(o,o)*o);
            smoothmin(ret, d, sm, ret);
        }
    
    d = ret;
    z = pf;
}

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

void drevision(in vec2 x, out float ret)
{
    x *= 2./3.;
    ret = 1.;
    float da;

    float n = 0.;
    for(int i=0; i<npts/4; ++i)
    {
        vec2 ptsi = vec2(path[4*i], path[4*i+1]),
            ptsip1 = vec2(path[4*i+2], path[4*i+3]),
            k = x-ptsi, 
            d = ptsip1-ptsi;
        
        float beta = k.x/d.x,
            alpha = d.y*k.x/d.x-k.y;
        
        n += step(.0, beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, ptsi, ptsip1, da);
        ret = min(ret, da);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
    ret *= 3./2.;
}

// Extrusion
void zextrude(in float z, in float d2d, in float h, out float d)
{
    vec2 w = vec2(d2d, abs(z)-0.5*h);
    d = min(max(w.x,w.y),0.0) + length(max(w,0.0));
}

void add(in vec2 sda, in vec2 sdb, out vec2 sdf)
{
    sdf = (sda.x<sdb.x)?sda:sdb;
}

void wall_scene(in vec3 x, out vec2 sdf)
{
    vec2 vi, dv;
    
    mfnoise(x.xy,1.e2,1.e4,.55,dv.x);
    x.z -= .0005*dv.x;
    
    sdf = vec2(x.z, 1.);
}

void main_scene(in vec3 x, out vec2 sdf)
{
    x.y *= .8;
    vec2 vi, dv;
    
    sdf = vec2(x.z, 1.);

    rand(floor(ssize*x.xy),dv.x);
    rand(floor(ssize*x.xy)-1337.,dv.y);
    dv *= .05;
    float d, d0;
    drevision(x.xy-.5*dv, d);
    
    // Black inside
    d0 = d;
    zextrude(x.z, d, .13*nBeats/26., d);
    add(sdf, vec2(d,1.), sdf);
    
    // Red outside
    rand(floor(2.*ssize*x.zx)+1337., dv.x);
    rand(floor(ssize*x.zx)+2337., dv.y);
    dv *= .05;
    d = abs(d0)-.0029-.003*iScale+.001*dv.x;
    zextrude(x.z+-.05+2.*dv.y, d, .15*nBeats/26., d);
    add(sdf, vec2(d, 1.), sdf);
    sdf.x -= .001;
    
    sdf.x /= 4.;
}

#define normal(o, t)void o(in vec3 x, out vec3 n, in float dx){vec2 s, na;t(x,s);t(x+dx*c.xyy, na);n.x = na.x;t(x+dx*c.yxy, na);n.y = na.x;t(x+dx*c.yyx, na);n.z = na.x;n = normalize(n-s.x);} 
// FIXME #CRLF  
normal(main_normal, main_scene)
normal(wall_normal, wall_scene)

#define march(id, sid)void id(out vec3 x, in vec3 o, inout float d, in vec3 dir, in int N, out int i, out vec2 s){for(i = 0; i<N; ++i){x=o+d*dir;sid(x,s);if(s.x < 1.e-4) return;d+=min(s.x,8.e-3);}}
// FIXME #CRLF
march(march_main, main_scene)
march(march_wall, wall_scene)

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}

const vec3 black = vec3(0.05,0.04,0.05),
        white = 2.*vec3(1.00,1.00,0.98),
        pink = 2.*vec3(0.96,0.06,0.40),
        red = 2.*vec3(0.84,0.20,0.19),
        blue = 1.5*vec3(0.31,0.49,0.74)
        ;
void revision_texture(in vec2 uv, out vec3 col)
{
    uv.y *= .8;
    vec2 vi, dv;
    
    col = .5*white;
    
    // Grid
    vec3 c1;
    vec2 size = vec2(.1,.02),
        sd = abs(mod(uv,size.x)-.5*size.x)-.0001;
    c1 = mix(col, black, sm(min(sd.x,sd.y)));
    sd = abs(mod(uv,size.y)-.5*size.y);
    c1 = mix(c1, black, sm(min(sd.x,sd.y)));

    
    // Text
    rand(floor(ssize*uv),dv.x);
    rand(floor(ssize*uv)-1337.,dv.y);
    dv *= .05;
    vec2 dva = dv;
    float d, da, db;
    drevision(uv-.5*dv, d);
    lfnoise(2.*ssize*uv-.3*iTime, dv.x);
    lfnoise(2.*ssize*uv-1337.-.3*iTime, dv.y);
    drevision(uv-.05*dv, da);
    da = abs(da)-.1;
    drevision(uv-.01*dv, db);
    db = abs(db)-.1;
    col = mix(col, c1, sm(db-.1));
    col = mix(col, black, sm(da)); // background 
    da = abs(da)-.02;
    col = mix(col, red, sm(da)); // background outline
    da = abs(da)-.005;
    col = mix(col, white, sm(da)); // background outline outline
    da = abs(da)-.002;
    col = mix(col, pink, sm(da)); // outline outline outline
    
    // Stars and shit
    for(float i = 20.; i< 30.; i += 1.)
    {
        vec2 dx;
        rand(i*c.xx, dx.x);
        rand(i*c.xx+1337., dx.y);
        dx = 2.*dx-1.;
        float da = length((uv-vec2(.8,.25)*dx)*vec2(25.,1.)*1.5)-.01,
            db = length((uv-vec2(.8,.25)*dx)*vec2(1.,25.)*1.5)-.01;
        smoothmin(da, db, 1.2, da);
        col = mix(col, white, sm(abs(da+.03)-.15));
        col = mix(col, black, sm(abs(abs(da+.03)-.15)-.01));
        smoothmin(da, db, .08, da);
        col = mix(col, 14.*white*white, sm(abs(da+.03)-.08));
        smoothmin(da, db, .04, da);
        col = mix(col, .5*red*red, sm(abs(da+.03)-.05));
        smoothmin(da, db, .02, da);
        col = mix(col, .5*red, sm(da+.03));
    }
    
    col = mix(col,mix(1.5*red, blue, sm(uv.y/100.)), sm(d));
    d = abs(d)-.004;
    col = mix(col, blue, sm(d));
    drevision(uv, db);
    col = mix(col, 1.5*blue, sm(db+.02)); // Revision body
    db = abs(db+.01)-.002;
    col = mix(col, 4.*white, sm(db)); // Revision body outline
    db = abs(db)-.002;
    col = mix(col, pink, sm(db)); // Revision body outline outline
    
}

void illuminate(in vec3 x, in vec3 n, in vec3 dir, in vec3 l, inout vec3 col, in vec2 s)
{
    if(s.y == 1.) // Graffiti
    {
        revision_texture(x.xy, col);
        vec2 vi;
        float v;
        dsmoothvoronoi(22.*x.xy, .04, v, vi);
        v = abs(v)-.1;
        vec3 c1 = mix(col, vec3(0.93,0.18,0.25), sm(v));
        c1 = mix(c1, pink, sm(abs(v)-.01));
        col = mix(col, c1, sm(abs(x.z-.03)-.025));
        col = .1*col
            + .1*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y,
        s, ss,
        s0;
        
    scale(iTime+35.8321, iScale);
    nbeats(iTime+35.8321, nBeats);
    
    vec3 col = c.yyy,
        o = c.yzx,
        o0 = o,
        r = c.xyy,
        t = c.yyy, 
        u = cross(normalize(t-o),-r),
        dir,
        n, 
        x,
        c1 = c.yyy,
        l,
        dir0,
        x0,
        c2,
        n0;
    int N = 250,
        i;
    float d = 0., d0;
    
    t += uv.x * r + uv.y * u;
    //o += uv.x * r + uv.y * u;
    dir = normalize(t-o);
    
    d = -(o.z-.2)/dir.z;
    march_wall(x, o, d, dir, N, i, s);
    vec3 xa = x;
    wall_normal(x, n, 5.e-5);
    vec3 na = n;
    d = -(o.z-.2)/dir.z;
    march_main(x, o, d, dir, N, i, s);
    
    l = normalize(c.xzx);
    
    if(i<N)
    {
        main_normal(x, n, 5.e-5);
        illuminate(x, n, dir, normalize(l), col, s);
    } else d0 = -1.;

    o = o0;
    dir = dir0;
    x = x0;
    s = s0;
    
    // Soft shadow
    //*
    //if(s.y != 5.)
    {
        o = x;
        dir = normalize(l-o);
        d = 1.e-2;
        
        march_main(x, o, d, dir, N, i, s);
        
        if(i<N)
        {
            if(x.z < .2) col *= .6;
        }
    }
    //*/

    // Ambient
    col *= (1.+1./length(x-l));
    
    // Fog
    //col = mix(col, vec3(0.96,0.91,0.85), smoothstep(2.,15.,d0-2.));
    //if(d0 == -1.) col = vec3(0.96,0.91,0.85);
    
    x = x0;
    
    col = .5*col
        + .7*col*dot(l, na)
        + 1.8*col*pow(abs(dot(reflect(l,na),dir)),2.);

    // Gamma
    col = col + 4.* col * col;

    col = mix(c.xxx, col, clamp(iTime, 0.,1.));
    fragColor = vec4(clamp(col,0.,1.),1.);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
