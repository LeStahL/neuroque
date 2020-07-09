#version 130

out vec4 gl_FragColor;

uniform float iTime;
uniform vec2 iResolution;

uniform float iFader0;
uniform float iFader1;
uniform float iFader2;
uniform float iFader3;
uniform float iFader4;
uniform float iFader5;
uniform float iFader6;
uniform float iFader7;

uniform float iScale;
uniform float iNBeats;

const float pi = acos(-1.);
const vec3 c = vec3(1.,0.,-1.);
const float box_size = .4,
    depth = 7.,
    dz = -.01;

void rand(in vec2 x, out float n);
void lfnoise(in vec2 t, out float n);
void mfnoise(in vec2 x, in float d, in float b, in float e, out float n);
void dbox3(in vec3 x, in vec3 b, out float d);
void dbox3_wireframe(in vec3 x, in vec3 b, in float db, out float d);
 void zextrude(in float z, in float d2d, in float h, out float d);
float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}
void add(in vec2 sda, in vec2 sdb, out vec2 sdf);
void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d);
void smoothmin(in float a, in float b, in float k, out float dst);
void rot3(in vec3 p, out mat3 rot);
void main_scene(in vec3 x, out vec2 sdf)
{

    sdf = vec2(x.z+.4,0.);
    const float size = .2;
    float d;
    
    float p = 8.*x.x-2.*iTime;
    mat2 R = mat2(cos(p), -sin(p), sin(p), cos(p));
    
    float na;
    lfnoise(7.*x.x*c.xx-iTime, na);
    na = mix(0., na, clamp(iTime-5.910+.25,0.,.5)/.5);

    const float csize = pi/8.;
    vec2 pa = R * x.yz;
    float ps = atan(pa.y,pa.x),
        dps = mod(ps, 2.*csize)-csize,
        dpsj = ps-dps;

    
    
    add(sdf, vec2((length(R*x.yz-(.15+.15*x.x*x.x)*vec2(cos(dpsj), sin(dpsj)))-.005+mix(-.04,.04,clamp(iTime-12.105+.25,0.,.5)/.5)*x.x)-.01-.01*na, 3.), sdf);
    add(sdf, vec2((length(R*x.yz+mix(-.15*c.yx,-(.15+.15*x.x*x.x)*vec2(cos(dpsj), sin(dpsj)),clamp(iTime-29.222+.25,0.,.5)/.5))-.03+mix(-.06,.06,clamp(iTime-12.105+.25,0.,.5)/.5)*x.x)-.01-.01*na, 7.), sdf);
    add(sdf, vec2((length(R*x.yz-.19*c.zx)-.03+mix(-.07,.07,clamp(iTime-12.105+.25,0.,.5)/.5)*x.x)-.01-.01*na, 6.), sdf);
    add(sdf, vec2((length(R*x.yz-.1*c.yx)-.03+mix(-.04,.04,clamp(iTime-12.105+.25,0.,.5)/.5)*x.x-.01*sin(iTime-5.*x.x)-.01*na)-.01, 4.), sdf);
}


void main_normal(in vec3 x, out vec3 n, in float dx)
{
    vec2 s, na;
    main_scene(x,s);
    main_scene(x+dx*c.xyy, na);
    n.x = na.x;
    main_scene(x+dx*c.yxy, na);
    n.y = na.x;
    main_scene(x+dx*c.yyx, na);
    n.z = na.x;
    n = normalize(n-s.x);
} 

#define march(id, sid, exit, step)void id(out vec3 x, in vec3 o, inout float d, in vec3 dir, in int N, out int i, out vec2 s){for(i = 0; i<N; ++i){x=o+d*dir;sid(x,s);if(s.x < 1.e-4) return; if(exit){i=N;}d+=step;}}
march(march_main, main_scene, false, min(s.x,6.2e-3))
march(march_shadow, main_scene, x.z>1., min(s.x,8.e-4))

void illuminate(in vec3 x, in vec3 n, in vec3 dir, in vec3 l, inout vec3 col, in vec2 s)
{
    l = normalize(l);
    if(s.y == -1.) // Structure wireframe black
    {
        col = vec3(0.09,0.09,0.29);
        col = .6*col
            + .8*col*max(dot(l-x,n),0.)
            + 1.5*col*pow(max(dot(reflect(l-x,n),dir),0.),2.);
    }
    else if(s.y == 0.) // Floor
    {
        col = vec3(1.00,0.50,0.27);
        col = .1*col
            + .8*col*max(dot(l-x,n),0.)
            + .5*col*pow(max(dot(reflect(l-x,n),dir),0.),2.);
    }
    else if(s.y == 1.) // Structure wireframe white
    {
        col = vec3(1.00,0.36,0.24);
        col = .2*col
            + .3*col*max(dot(l-x,n),0.)
            + 1.5*col*pow(max(dot(reflect(l-x,n),dir),0.),2.);
    }
    else if(s.y == 2.)
    {
        col = vec3(0.18,0.14,0.19);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + .3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 3.)
    {
        col = .1*vec3(0.18,0.16,0.20);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + .3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 4.)
    {
        col = vec3(0.52,0.24,0.24);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + .3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 5.)
    {
        col = .2*vec3(0.08,0.65,0.86);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + 1.3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 6.)
    {
        col = .2*vec3(0.62,0.60,0.60);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + 1.3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 7.)
    {
        col = .4*vec3(0.72,0.20,0.21);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + 1.3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    
    float p = 8.*x.x-2.*iTime;
    mat3 R;
    rot3(p*c.xxx, R);
    col = mix(col, abs(R*col), .1*x.x);
}

float a = 1.0;

void dbox210(in vec3 x, in float size, out vec2 sdf);
void image210( inout vec3 col, in vec2 uv )
{
    float size = 1.,
        d;
    vec2 sdf;
    
    dbox210(vec3((uv-.5*size*c.xy).yx, 0.15), size, sdf);
    d = sdf.x;
    dbox210(vec3(.15, uv*c.xz), size, sdf);
    d = min(d,sdf.x);
    dbox210(vec3(.15, (uv+.5*size*c.xy).yx).yxz, size, sdf);
    d = min(d,sdf.x);
    
    col = mix(col, mix(col,c.xxx,.2), sm(d));
    // col = mix(col, mix(col, vec3(0.87,0.24,0.59), .2), sm(abs(d-.01)-.005));
}

void dbox(in vec2 x, in vec2 b, out float d);
void dmercury(in vec2 x, out float d);
void rgb2hsv(in vec3 c, out vec3 o);
void hsv2rgb(in vec3 c, out vec3 o);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // POSITION_EPSILON_MINIMUM = 1.5/iResolution.y;
    
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y,
        s, ss,
        s0;
    vec3 col = c.yyy,
        o = c.yyx,
        o0 = o,
        r = c.xyy,
        t = c.yyy, 
        u = cross(normalize(t-o),-r),
        dir,
        n, 
        x, y,
        c1 = c.yyy,
        l,
        l2,
        dir0,
        x0,
        c2,
        n0;
    int N = 300,
        i;

    t += uv.x * r + uv.y * u;
    dir = normalize(t-o);

    y = o-(o.z-.4)/dir.z*dir;

        float d = 0.,// -(o.z+.1)/dir.z, 
        d0;
    
    march_main(x, o, d, dir, N, i, s);
    l = vec3(-.3,.3,1.);
    l2 = vec3(-.3,-.3,1.);
    
//    if(i<N)
    {
        main_normal(x, n, 5.e-3);
        n = round(n);
    }

    
    illuminate(x, n, dir, l, col, s);
    illuminate(x, n, dir, l2, c1, s);
    col = mix(col, c1, .5);
    
    if(s.y == 0.)
    {
        o0 = x;
        dir0 = reflect(dir, n);
        d0 = .01;
        
        {

        march_main(x0, o0, d0, dir0, N, i, s0);
        }
        if(i<N)
        {
            main_normal(x0, n0, 5.e-4);
            n = round(n);
            illuminate(x0, n0, dir0, l, c1, s0);
            illuminate(x0, n0, dir0, l2, c2, s0);
            c1 = mix(c1, c2, .5);
        	col = mix(col, c1, .4);
        }
        // }
    }

    // logo210
    image210(col, 2.*(x.xy-vec2(.5,-.7)));

    // mercury credit
    float ff,fa;
    dbox(x.xy-vec2(.5,-.94), vec2(.1), fa);
    dmercury(8.*(x.xy-vec2(.5,-.94)), ff);
    col = mix(col, mix(col, vec3(0.87,0.24,0.59), .5), sm(max(fa,-ff/8.)));

    // Soft shadow
    x0 = x;

    o = x;
    dir = normalize(l-x);
    d = 1.e-2;
    // analytical_box(o, dir, box_size*c.xxx, d);
    
    // if(d < 1.e2)
    {
        float res = 1.0;
        float ph = 1.e20;
        for(int i=0; i<N; ++i)
        // for(d=1.e-2; x.z<.5; )
        {
            x = o + d * dir;
            main_scene(x, s);
            if(s.x < 1.e-4) 
            {
                res = 0.;
                break;
            }
            if(x.z>.5) break;
            float y = s.x*s.x/(2.0*ph)/12.;
            float da = sqrt(s.x*s.x-y*y);
            res = min( res, 100.0*da/max(0.0,d-y) );
            ph = s.x;
            d += min(s.x,5.e-3);
        }
        col = mix(.7*col, col, res);
    }
    
    x = x0;
    o = x;
    dir = normalize(l2-x);
    d = 1.e-2;
    // analytical_box(o, dir, box_size*c.xxx, d);
    
    // if(d < 1.e2)
    {
        float res = 1.0;
        float ph = 1.e20;
        for(int i=0; i<N; ++i)
        // for(d=1.e-2; x.z<.5; )
        {
            x = o + d * dir;
            main_scene(x, s);
            if(s.x < 1.e-4) 
            {
                res = 0.;
                break;
            }
            if(x.z>.5) break;
            float y = s.x*s.x/(2.0*ph)/12.;
            float da = sqrt(s.x*s.x-y*y);
            res = min( res, 100.0*da/max(0.0,d-y) );
            ph = s.x;
            d += min(s.x,5.e-3);
        }
        col = mix(.7*col, col, res);
    }

    // Gamma
    col = .5*col + .6*col*col + .4*col*col*col;
    col *= 1.3;

    float nar, nara;
    // mfnoise(y.xy, 4., 2000., .45, nar);
    mfnoise(y.xy-.1*iTime*c.xy, 5., 2000., .65, nara);

    // col = mix(col,mix(vec3(0.67,0.13,0.18),vec3(0.06,0.36,0.38),length(y+.2*c.yyx)/.5), smoothstep(.5,-.4,length(y+.2*c.yyx)/.5));
    
    if(col.r + col.g > .3)
    {
        // col = mix(col, mix(col,.02*c.xxx, .3), sm(abs(nar)-.01));
        col = mix(col, mix(col,vec3(0.35,0.47,0.63), .3), sm(abs(nar)-.004));
        col = mix(col, .02*col, abs(nara)-.1);
    }
    
    col = mix(col,mix(vec3(0.67,0.13,0.18),vec3(0.06,0.36,0.38),abs(y.y-.3)/.5), .3*smoothstep(-.5,.01,y.y-.3));
    col = mix(col, mix(col, 2.*col, .5), sm(abs(y.y-.3)-.21));
    col = mix(col, mix(col, 2.*col, .3), sm(abs(abs(y.y-.3)-.21)-.05));
    col = mix(col, mix(col, .1*col, .3), sm(abs(abs(abs(y.y-.3)-.21)-.05)-.002));

    col = mix(.6*col,col*.01, smoothstep(-.25,.3,abs(y.y)));
    
    col = mix(col, c.yyy, smoothstep(.3,1.5,abs(uv.y/.5)));
    // col = mix(col, col.brg, iScale);


    vec3 hsv;
    rgb2hsv(col, hsv);
    hsv.x = mix(.5,.33, clamp(iTime-12.105+.25,0.,.5)/.5);
    hsv2rgb(hsv, c1);
    col = mix(col, c1, clamp(iTime-5.910+.25,0.,.5)/.5);

    col = mix(col, c.xxx*length(col)/sqrt(3.), clamp(iTime-37.302+.25,0.,.5)/.5);

    col = mix(c.yyy, col, 1.-clamp(iTime-49.137+.25,0.,1.)/.5);
    fragColor = vec4(clamp(col,0.,1.),1.);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
