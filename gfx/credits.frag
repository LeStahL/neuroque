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
float zup = .4;

float iScale, nBeats;
void scale(in float time, out float s);
void nbeats(in float time, out float n);


const int npts = 280;
const float path[npts] = float[npts](-0.337,-0.054,-0.321,-0.071,-0.321,-0.071,-0.297,-0.055,-0.297,-0.055,-0.337,-0.054,-0.060,-0.139,-0.128,-0.099,-0.128,-0.099,-0.089,-0.020,-0.089,-0.020,0.106,-0.031,0.106,-0.031,0.133,-0.047,0.133,-0.047,0.182,-0.032,0.182,-0.032,0.421,-0.031,0.421,-0.031,0.436,-0.106,0.436,-0.106,0.347,-0.143,0.347,-0.143,0.235,-0.145,0.235,-0.145,0.221,-0.083,0.221,-0.083,0.155,-0.104,0.155,-0.104,0.081,-0.082,0.081,-0.082,0.061,-0.142,0.061,-0.142,-0.060,-0.139,-0.484,0.017,-0.500,-0.096,-0.500,-0.096,-0.337,-0.145,-0.337,-0.145,-0.245,-0.131,-0.245,-0.131,-0.221,-0.141,-0.221,-0.141,-0.121,-0.115,-0.121,-0.115,-0.151,-0.102,-0.151,-0.102,-0.118,-0.019,-0.118,-0.019,-0.315,-0.014,-0.315,-0.014,-0.484,0.017,0.188,0.144,0.060,0.062,0.060,0.062,0.150,0.029,0.150,0.029,0.324,0.046,0.324,0.046,0.294,-0.024,0.294,-0.024,0.417,-0.023,0.417,-0.023,0.430,0.050,0.430,0.050,0.494,0.058,0.494,0.058,0.500,0.104,0.500,0.104,0.419,0.096,0.419,0.096,0.420,0.114,0.420,0.114,0.345,0.107,0.345,0.107,0.336,0.088,0.336,0.088,0.214,0.074,0.214,0.074,0.372,0.144,0.372,0.144,0.188,0.144,-0.016,0.101,-0.018,0.124,-0.018,0.124,0.029,0.123,0.029,0.123,-0.016,0.101,-0.108,0.068,-0.075,0.066,-0.075,0.066,-0.078,0.145,-0.078,0.145,0.165,0.144,0.165,0.144,0.031,0.058,0.031,0.058,0.142,0.018,0.142,0.018,0.297,0.036,0.297,0.036,0.269,-0.024,0.269,-0.024,0.011,-0.020,0.011,-0.020,-0.027,0.009,-0.027,0.009,-0.026,-0.017,-0.026,-0.017,-0.117,-0.011,-0.117,-0.011,-0.108,0.068,-0.484,0.023,-0.484,0.064,-0.484,0.064,-0.450,0.058,-0.450,0.058,-0.455,0.138,-0.455,0.138,-0.309,0.137,-0.309,0.137,-0.266,0.112,-0.266,0.112,-0.262,0.145,-0.262,0.145,-0.091,0.145,-0.091,0.145,-0.092,0.096,-0.092,0.096,-0.125,0.098,-0.125,0.098,-0.137,-0.011,-0.137,-0.011,-0.303,-0.008,-0.303,-0.008,-0.354,0.027,-0.354,0.027,-0.350,-0.002,-0.350,-0.002,-0.484,0.023);
const int npts2 = 68;
const float path2[npts2] = float[npts2](-0.028,0.035,0.066,0.069,0.066,0.069,-0.170,0.086,-0.170,0.086,-0.028,0.035,0.189,0.143,-0.500,0.145,-0.500,0.145,-0.434,0.017,-0.434,0.017,-0.265,-0.022,-0.265,-0.022,-0.434,-0.046,-0.434,-0.046,-0.340,-0.145,-0.340,-0.145,0.255,-0.145,0.255,-0.145,0.500,-0.080,0.500,-0.080,0.472,-0.011,0.472,-0.011,0.349,-0.002,0.349,-0.002,0.170,-0.053,0.170,-0.053,0.283,-0.066,0.283,-0.066,0.028,-0.067,0.028,-0.067,0.406,0.059,0.406,0.059,0.189,0.143);

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

void hash33(in vec3 p3, out vec3 d);

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

void dcredits(in vec2 x, out float ret)
{
//     x *= 2./3.;
//     x *= vec2(1.,.5)*
    x.y *= .5;
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
//     ret *= 3./2.;
    ret *= 2.;
}

void dampersand(in vec2 x, out float ret)
{
    x *= 6.;
//     x *= 2./3.;
//     x *= vec2(1.,.5)*
    x.y *= .5;
    ret = 1.;
    float da;

    float n = 0.;
    for(int i=0; i<npts2/4; ++i)
    {
        vec2 ptsi = vec2(path2[4*i], path2[4*i+1]),
            ptsip1 = vec2(path2[4*i+2], path2[4*i+3]),
            k = x-ptsi, 
            d = ptsip1-ptsi;
        
        float beta = k.x/d.x,
            alpha = d.y*k.x/d.x-k.y;
        
        n += step(.0, beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, ptsi, ptsip1, da);
        ret = min(ret, da);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
//     ret *= 3./2.;
    ret *= 2.;
    ret /= 6.;
}

void dist3(in vec3 a, in vec3 b, out float d)
{
    d = length(b-a);
}

void nearest_controlpoint3(in vec3 x, out vec3 p)
{
    float dmin = 1.e5, 
        d;
    vec3 dp,
        y = floor(x);
    
    for(float i = -1.; i <= 1.; i += 1.)
        for(float j = -1.; j <= 1.; j += 1.)
        {
            for(float k = -1.; k <= 1.; k += 1.)
            {
                hash33(y+vec3(i,j,k), dp);
                dp += y+vec3(i,j,k);
                dist3(x, dp, d);
                if(d<dmin)
                {
                    dmin = d;
                    p = dp;
                }
            }
        }
}

void dvoronoi3(in vec3 x, out float d, out vec3 p, out float control_distance)
{
    d = 1.e4;
    vec3 y,
        dp;
    
    nearest_controlpoint3(x, p);
    y = floor(p);
    
    control_distance = 1.e4;
    
    for(float i = -2.; i <= 2.; i += 1.)
        for(float j = -2.; j <= 2.; j += 1.)
        {
            for(float k = -1.; k <= 1.; k += 1.)
            {
                if(i==0. && j==0. && k == 0.) continue;
                hash33(y+vec3(i,j,k), dp);
                dp += y+vec3(i,j,k);
                vec3 o = p - dp;
                float l = length(o);
                d = min(d,abs(.5*l-dot(x-dp,o)/l));
                control_distance = min(control_distance,.5*l);
            }
        }
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

void dhexagonpattern(in vec2 p, out float d, out vec2 ind) 
{
    vec2 q = vec2( p.x*1.2, p.y + p.x*0.6 );
    
    vec2 pi = floor(q);
    vec2 pf = fract(q);

    float v = mod(pi.x + pi.y, 3.0);

    float ca = step(1.,v);
    float cb = step(2.,v);
    vec2  ma = step(pf.xy,pf.yx);
    
    d = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );
    ind = pi + ca - cb*ma;
    ind = vec2(ind.x/1.2, ind.y);
    ind = vec2(ind.x, ind.y-ind.x*.6);
}

void dbox3(in vec3 x, in vec3 b, out float d)
{
  vec3 da = abs(x) - b;
  d = length(max(da,0.0))
         + min(max(da.x,max(da.y,da.z)),0.0);
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

void smoothadd(in vec2 sda, in vec2 sdb, in float sm, out vec2 sdf)
{
    sdf = (sda.x<sdb.x)?sda:sdb;
    smoothmin(sda.x, sdb.x, sm, sdf.x);
}

// void wall_scene(in vec3 x, out vec2 sdf)
// {
//     vec2 vi, dv;
//     
//     mfnoise(x.xy,1.e2,1.e4,.55,dv.x);
//     x.z -= .0005*dv.x;
//     
//     sdf = vec2(x.z, 1.);
// }

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}

void rot3(in vec3 p, out mat3 rot)
{
    rot = mat3(c.xyyy, cos(p.x), sin(p.x), 0., -sin(p.x), cos(p.x))
        *mat3(cos(p.y), 0., -sin(p.y), c.yxy, sin(p.y), 0., cos(p.y))
        *mat3(cos(p.z), -sin(p.z), 0., sin(p.z), cos(p.z), c.yyyx);
}

const float psize = 5.;
void main_scene(in vec3 x, out vec2 sdf)
{
    float d;
    vec2 hpi;
    dhexagonpattern(psize*x.xy, d, hpi);
    d /= psize;
    d = abs(d)-.01;

    sdf = vec2(mix(x.z,x.z-.005, sm(d)), 0.); // Floor
    
    dcredits(x.xy, d);
    zextrude(x.z, d, .1, d);
    add(sdf, vec2(d, 1.), sdf);
    
    dampersand(x.xy-vec2(0.,-.05), d);
    zextrude(x.z, d, .15, d);
    add(sdf, vec2(d,2.), sdf);
}

#define normal(o, t)void o(in vec3 x, out vec3 n, in float dx){vec2 s, na;t(x,s);t(x+dx*c.xyy, na);n.x = na.x;t(x+dx*c.yxy, na);n.y = na.x;t(x+dx*c.yyx, na);n.z = na.x;n = normalize(n-s.x);} 
// FIXME #CRLF  
normal(main_normal, main_scene)
// normal(wall_normal, wall_scene)

#define march(id, sid, exit, step)void id(out vec3 x, in vec3 o, inout float d, in vec3 dir, in int N, out int i, out vec2 s){for(i = 0; i<N; ++i){x=o+d*dir;sid(x,s);if(s.x < 1.e-4) return; if(exit) return;d+=step;}}
// FIXME #CRLF
march(march_main, main_scene, x.z>.5, s.x)
march(march_reflected, main_scene, x.z>.5, s.x)
march(march_shadow, main_scene, x.z>.5, s.x)
// march(march_wall, wall_scene)

// void colorize_balls(in vec3 x, in vec3 n, inout vec3 col)
// {
//     col =  0.5 + 0.5*cos(iTime+x+vec3(0,2,4));
// }
// 
void colorize_floor(in vec3 x, in vec3 n, inout vec3 col)
{
    float d, r;
    vec2 hpi;
    dhexagonpattern(psize*x.xy, d, hpi);
    d /= psize;
    d = abs(-d)-.01;
    rand(hpi,r);
    col = mix(mix(.6,1.,r)*c.xxx,.7*c.xxx, sm(d));
}

void illuminate(in vec3 x, in vec3 n, in vec3 dir, in vec3 l, inout vec3 col, in vec2 s)
{
    if(s.y == 0.) // Floor
    {
//         col = .7*c.xxx;
        colorize_floor(x,n,col);
        col = .1*col
            + .3*col*dot(l, n)
            + .5*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 1.) // Text
    {
        col = vec3(0.93,0.29,0.20);
        col = .1*col
            + mix(.5,1.,mod(nBeats,2.))*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 2.) // Balls outside
    {
        col = c.xxx; // white
        float d;
        dampersand(x.xy-vec2(0.,-.05), d);
        d = abs(d)-.001;
        col = mix(col, .3*c.xxx, sm(d));
        col = .1*col
            + 1.1*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
//     else if(s.y == 3.) // white
//     {
//         col = vec3(1.00,1.00,0.99);
//         col = .1*col
//             + 1.1*col*dot(l, n)
//             + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
//     }
//     else if(s.y == 4.) // red
//     {
//         col = vec3(1.00,0.29,0.24);
//         col = .1*col
//             + .6*col*dot(l, n)
//             + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
//     }
//     else if(s.y == 5.) // green
//     {
//         col = vec3(0.53,0.86,0.40);
//         col = .1*col
//             + .5*col*dot(l, n)
//             + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
//     }
//     else if(s.y == 6.) // purple
//     {
//         col = vec3(1.00,0.32,0.89);
//         col = .1*col
//             + .5*col*dot(l, n)
//             + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
//     }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y,
        s, ss,
        s0;
    nbeats(92.9749+iTime,nBeats);
    scale(92.9749+iTime,iScale);       
//     zup = .4011;
//     zup = .3989;
    zup = .4;
    
    vec3 col = c.yyy,
        o = c.yzx-.2*c.xyy,
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
    int N = 150,
        i;
    float d = 0., d0;
    
    t += uv.x * r + uv.y * u;
    //o += uv.x * r + uv.y * u;
    dir = normalize(t-o);
    
//     d = -(o.z-.2)/dir.z;
//     march_wall(x, o, d, dir, N, i, s);
//     vec3 xa = x;
//     wall_normal(x, n, 5.e-5);
//     vec3 na = n;
    d = -(o.z-.15)/dir.z;
    march_main(x, o, d, dir, N, i, s);
    
    l = normalize(c.xzx);
    
    if(i<N)
    {
        main_normal(x, n, 5.e-3);
        illuminate(x, n, dir, normalize(l), col, s);
        
        s0 = s;
        x0 = x;
        o0 = o;
        d0 = d;
        dir0 = dir;
        n0 = n;
        
        o = x;
        d = 1.e-2;
        ss = s;
        
        for(int j = 0; j < 1; ++j)
        {
            if(s.y == 0.) // Transparent floor surface
            {
                dir = reflect(dir, n);

                march_reflected(x, o, d, dir, N, i, s);

                if(x.z<zup)
                {
                    main_normal(x, n, 5.e-4);
                    illuminate(x, n, dir, normalize(l), c1, s);
                    
                    col = mix(col, c1, .4);
                }
//             o = x;
//             d = 1.e-2;
//             ss = s;
            }
        }
    } else d0 = -1.;

    o = o0;
    dir = dir0;
    x = x0;
    s = s0;

//     o = o0;
//     dir = dir0;
//     x = x0;
//     s = s0;
    
    // Soft shadow
    //*
    //if(s.y != 5.)
    {
        o = x;
        dir = normalize(l-o);
        d = 1.e-2;
        
        march_shadow(x, o, d, dir, N, i, s);
        
        if(i<N)
        {
            if(x.z < .2) col *= .6;
        }
    }
    //*/

    // Ambient
//     col *= (1.+1./length(x-l));
    
    // Fog
    //col = mix(col, vec3(0.96,0.91,0.85), smoothstep(2.,15.,d0-2.));
    //if(d0 == -1.) col = vec3(0.96,0.91,0.85);
    
//     x = x0;
    
//     col = .5*col
//         + .7*col*dot(l, na)
//         + 1.8*col*pow(abs(dot(reflect(l,na),dir)),2.);

    // Gamma
    col = 2.* col * col;
    
        
    fragColor = vec4(clamp(col,0.,1.),1.);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
