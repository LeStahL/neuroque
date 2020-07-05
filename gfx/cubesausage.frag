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

// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// See https://www.shadertoy.com/view/4djSRW
void hash33(in vec3 p3, out vec3 d)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    d = fract((p3.xxy + p3.yxx)*p3.zyx);
}

void voronoi_controlpoint3(in vec3 x, out vec3 xv)
{
    float d, dm = 1.e5;
    vec3 p, dp, y = floor(x);
    
    for(float i=-2.; i<2.; i+=1.)
    {
        for(float j=-2.; j<2.; j+=1.)
        {
            for(float k = -2.; k <= 2.; k += 1.)
        	{
                p = y + vec3(i,j,k);
                hash33(1.e2*p, dp);
                p += dp;
                d = length(x-p);
                if(d<dm)
                {
                    xv = p;
                    dm = d;
                }
            }
        }
    }
}

void dvoronoi3(in vec3 x, out float d, out vec3 p, out float control_distance)
{
    d = 1.e4;
    vec3 y,
        dp;
    
    voronoi_controlpoint3(x, p);
    y = floor(p);
    
    control_distance = 1.e4;
    
    for(float i = -2.; i <= 2.; i += 1.)
        for(float j = -2.; j <= 2.; j += 1.)
        {
            for(float k = -2.; k <= 2.; k += 1.)
        	{
                if(i==0. && j==0.) continue;
                hash33(1.e2*(y+vec3(i,j,k)), dp);
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

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
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
    
    float cra = .1*x.x-iTime;
    mat2 RA = mat2(cos(cra),sin(cra),-sin(cra),cos(cra));
    x.yz = RA * x.yz;
    
    float msize = .05;
     //float dl, dc;
     vec3 a, aj;
     //dvoronoi3((x-.1*iTime*c.xyy)/msize, dl, aj, dc);
    voronoi_controlpoint3((x-.1*iTime*c.xyy)/msize, aj); 
    aj *= msize;
     a = x-.1*iTime*c.xyy-aj;
    
        //vec3 a = mod(x-.1*iTime*c.xyy, msize)-.5*msize,
        //aj = x-.1*iTime*c.xyy-a;
        
    vec3 r;
    lfnoise(aj.x*c.xx-.5*iTime, r.x);
    lfnoise(2.*aj.x*c.xx+1337.-1.1*iTime, r.y);
    lfnoise(2.*aj.x*c.xx+2337.-.2*iTime, r.z);
    
    float v = aj.x-1.1*iTime;
    lfnoise(v*c.xx, v);
    v += aj.x;
    mat2 m = mat2(cos(v),sin(v),-sin(v),cos(v));
    vec2 z = m*aj.yz;
    const float div = pi/4.;
    float p = mod(atan(z.y,z.x),div)-.5*div,
        pj = atan(z.y,z.x)-p,
        pjf = floor(pj/div);
    vec2 y = vec2((.7+.2*iScale)*.3*cos(pj), (.7+.2*iScale)*.3*sin(pj));
    
    d = length(z-y-.1*r.yz)-.1-.1*r.x;
//     sdf = vec2(d,0.);s
    if(d < 0.)
    {
        vec3 r2;
        rand(12.*aj.x*c.xx, r2.x);
        rand(12.*aj.y*c.xx, r2.y);
        rand(12.*aj.z*c.xx, r2.z);
        
        float rd;
        rand(aj.xy+aj.yz+aj.xz, rd);
        
        float rda;
        rand(pj*c.xx+aj.xy+aj.yz+aj.zx, rda);
        
        mat3 m;
        rot3(aj-r2-rd*iTime-rd, m);
        vec3 ar = m * a;
        if(rda >.5) 
        {
            dbox3(ar, .002+.33*rd*msize*c.xxx, d);
            add(sdf, vec2(d,2.+mod(pjf+nBeats,4.)), sdf);
            dbox3(ar, .002+.33*rd*msize*vec3(.6,.6,1.05), d);
            add(sdf, vec2(d, 2.+mod(pjf+nBeats+1., 4.)), sdf);
            dbox3(ar, .002+.33*rd*msize*vec3(.6,1.05,.6), d);
            add(sdf, vec2(d, 2.+mod(pjf+nBeats+1., 4.)), sdf);
            dbox3(ar, .002+.33*rd*msize*vec3(1.05,.6,.6), d);
            add(sdf, vec2(d, 2.+mod(pjf+nBeats+1., 4.)), sdf);
        }
        else
        {
            d = length(ar)-1.3*(.002+.33*rd*msize);
            add(sdf, vec2(d,2.+mod(pjf+nBeats,4.)), sdf);
//             d = length(ar.xy)-1.3*(.002+.33*rd*msize);
//             zextrude(ar.z, d, .33*rd*msize*.5, d);
//             add(sdf, vec2(d,2.+mod(pjf+1.+12.*rd,4.)), sdf);
//             d = length(ar.yz)-1.3*(.002+.33*rd*msize);
//             zextrude(ar.x, d, .33*rd*msize*.5, d);
//             add(sdf, vec2(d,2.+mod(pjf+1.+12.*rd,4.)), sdf);
//             d = length(ar.zx)-1.3*(.002+.33*rd*msize);
//             zextrude(ar.y, d, .33*rd*msize*.5, d);
//             add(sdf, vec2(d,2.+mod(pjf+1.+12.*rd,4.)), sdf);
        }
    }
}

#define normal(o, t)void o(in vec3 x, out vec3 n, in float dx){vec2 s, na;t(x,s);t(x+dx*c.xyy, na);n.x = na.x;t(x+dx*c.yxy, na);n.y = na.x;t(x+dx*c.yyx, na);n.z = na.x;n = normalize(n-s.x);} 
// FIXME #CRLF  
normal(main_normal, main_scene)
// normal(wall_normal, wall_scene)

#define march(id, sid, exit, step)void id(out vec3 x, in vec3 o, inout float d, in vec3 dir, in int N, out int i, out vec2 s){for(i = 0; i<N; ++i){x=o+d*dir;sid(x,s);if(s.x < 1.e-4) return; if(exit) return;d+=step;}}
// FIXME #CRLF
march(march_main, main_scene, x.z>12., min(s.x,8.e-3))
march(march_reflected, main_scene, x.z>12., min(s.x,1.e-2))
march(march_shadow, main_scene, x.z>zup, min(s.x,1.e-2))
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
        colorize_floor(x,n,col);
        col = .1*col
            + .3*col*dot(l, n)
            + .5*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
//     else if(s.y == 1.) // Balls inside
//     {
//         col = vec3(0.93,0.29,0.20);
//         col = .1*col
//             + mix(.5,1.,step(fract(iTime),.5))*col*dot(l, n)
//             + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
//     }
    else if(s.y == 2.) // Balls outside
    {
        col = .15*c.xxx; // black
        col = .1*col
            + 1.1*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 3.) // white
    {
        col = vec3(1.00,1.00,0.99);
        col = .1*col
            + 1.1*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 4.) // red
    {
        col = vec3(1.00,0.29,0.24);
        col = .1*col
            + .6*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 5.) // green
    {
        col = vec3(0.53,0.86,0.40);
        col = .1*col
            + .5*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
    else if(s.y == 6.) // purple
    {
        col = vec3(1.00,0.32,0.89);
        col = .1*col
            + .5*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y,
        s, ss,
        s0;
    
    nbeats(58.6892+iTime,nBeats);
    scale(58.6892+iTime,iScale);

    
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
    int N = 250,
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
    d = -(o.z-zup)/dir.z;
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
