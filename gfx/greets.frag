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

float beats;
void nbeats(out float s)
{
    s = round((iTime+74.)/ 0.35715 );
}

void stroke(in float d0, in float s, out float d)
{
    d = abs(d0)-s;
}

void dcircle(in vec2 x, out float d)
{
    d = length(x)-1.0;
}

void dbox(in vec2 x, in vec2 b, out float d)
{
    vec2 da = abs(x)-b;
    d = length(max(da,c.yy)) + min(max(da.x,da.y),0.0);
}

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

void rot(in float phi, out mat2 m)
{
    vec2 cs = vec2(cos(phi), sin(phi));
    m = mat2(cs.x, -cs.y, cs.y, cs.x);
}

// Adapted from iq, https://www.shadertoy.com/view/XsXSz4
void dtriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2, out float dst)
{
	vec2 e0 = p1 - p0;
	vec2 e1 = p2 - p1;
	vec2 e2 = p0 - p2;

	vec2 v0 = p - p0;
	vec2 v1 = p - p1;
	vec2 v2 = p - p2;

	vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
	vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
	vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );
    
    float s = sign( e0.x*e2.y - e0.y*e2.x );
    vec2 d = min( min( vec2( dot( pq0, pq0 ), s*(v0.x*e0.y-v0.y*e0.x) ),
                       vec2( dot( pq1, pq1 ), s*(v1.x*e1.y-v1.y*e1.x) )),
                       vec2( dot( pq2, pq2 ), s*(v2.x*e2.y-v2.y*e2.x) ));

	dst = -sqrt(d.x)*sign(d.y);
}

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

void dpolygon(in vec2 x, in float N, out float d)
{
    d = 2.0*pi/N;
    float t = mod(acos(x.x/length(x)), d)-0.5*d;
    d = -0.5+length(x)*cos(t)/cos(0.5*d);
}

void d5711(in vec2 x, out float ret);
void dfarbrausch(in vec2 x, out float ret);
void ddeadline(in vec2 x, out float ret);
void dhaujobb(in vec2 x, out float ret);
void dkewlers(in vec2 x, out float ret);
void dmercury(in vec2 x, out float ret);
void drevision(in vec2 x, in float r, out float ret);
void dschnappsgirls(in vec2 x, out float ret);
void dspacepigs(in vec2 x, out float ret);

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
    hpi /= psize;
    d /= psize;
    d = abs(d)-.01;

    sdf = vec2(mix(x.z,x.z-.005, sm(d)), 0.); // Floor
    
//     vec2 a = hpi/psize;
    vec2 a = hpi;
    vec2 y = x.xy-a;
//     float dd = 2./psize;
//     vec2 y = mod(x.xy,dd)-.5*dd,
//         a = x.xy-y/dd+.5;
    
    float nan = mod(.5*nBeats, 9.);
    
    if(a==c.yy && nan < 1.) d5711(psize*y, d);
    else if(a==c.yy && nan < 2.) dmercury(psize*y, d);
    else if(a==c.yy && nan < 3.) dfarbrausch(psize*y, d);
    else if(a==c.yy && nan < 4.) ddeadline(psize*y, d);
    else if(a==c.yy && nan < 5.) dspacepigs(psize*y, d);
    else if(a==c.yy && nan < 6.) dhaujobb(psize*y, d);
    else if(a==c.yy && nan < 7.) dschnappsgirls(psize*y, d);
    else if(a==c.yy && nan < 8.) dkewlers(psize*y, d);
    else if(a==c.yy && nan < 9.) drevision(psize*y,1., d);
    else d = 1.;
    d/=psize;
    zextrude(x.z, d, .05, d);
    add(sdf, vec2(d,1.), sdf);
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
    else if(s.y == 1.) // Balls inside
    {
        col = vec3(0.93,0.29,0.20);
        col = .1*col
            + mix(.5,1.,mod(nBeats,2.))*col*dot(l, n)
            + 1.1*col*pow(abs(dot(reflect(l,n),dir)),2.);
    }
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
        
    nbeats(81.5463+iTime,nBeats);
    scale(81.5463+iTime,iScale);    
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
