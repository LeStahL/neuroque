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

void dbox3(in vec3 x, in vec3 b, out float d)
{
  vec3 da = abs(x) - b;
  d = length(max(da,0.0))
         + min(max(da.x,max(da.y,da.z)),0.0);
}

void cartesian_to_polar(in vec2 x, out vec2 y)
{
    y = vec2(length(x), atan(x.y,x.x));
}

void polar_to_cartesian(in vec2 x, out vec2 y)
{
    y = x.x*vec2(cos(x.y),sin(x.y));
}

void dbox3_wireframe(in vec3 x, in vec3 b, in float db, out float d)
{
    dbox3(x,b,d);
    
    float da;
    dbox3(x, b+c.zzx*db, da);
    d = max(d, -da);
    dbox3(x, b+c.xzz*db, da);
    d = max(d, -da);
    dbox3(x, b+c.zxz*db, da);
    d = max(d, -da);
}

 void zextrude(in float z, in float d2d, in float h, out float d)
 {
     vec2 w = vec2(d2d, abs(z)-0.5*h);
     d = min(max(w.x,w.y),0.0) + length(max(w,0.0));
 }

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}



void add(in vec2 sda, in vec2 sdb, out vec2 sdf)
{
    sdf = (sda.x<sdb.x)?sda:sdb;
}

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

vec2 pj(in vec2 x, in int j, in float N)
{
    float p = float(j)*2.*pi/N;
    return vec2(cos(p), sin(p));
}

// iq's smooth minimum
void smoothmin(in float a, in float b, in float k, out float dst)
{
    float h = max( k-abs(a-b), 0.0 )/k;
    dst = min( a, b ) - h*h*h*k*(1.0/6.0);
}

void dpolygon(in vec2 x, in float N, out float ret)
{
	float n = 0., ls;
    ret = 1.;
    
    for(int i=0; i<int(N); ++i)
    {
        int ip1 = int(mod(float(i+1), N));
        vec2 k = x-pj(x, i, N), d = pj(x, ip1, N)-pj(x, i, N);
        
        float beta = k.y/d.y,
            alpha = d.x*k.y/d.y-k.x;
        
        n += step(0., beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, pj(x, i, N), pj(x, ip1, N), ls);
        ret = min(ret, ls);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
}

void dsmoothpolygon(in vec2 x, in float N, in float s, out float ret)
{
	float n = 0., ls;
    ret = 1.;
    
    for(int i=0; i<int(N); ++i)
    {
        int ip1 = int(mod(float(i+1), N));
        vec2 k = x-pj(x, i, N), d = pj(x, ip1, N)-pj(x, i, N);
        
        float beta = k.y/d.y,
            alpha = d.x*k.y/d.y-k.x;
        
        n += step(0., beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, pj(x, i, N), pj(x, ip1, N), ls);
        smoothmin(ret, max(ls,0.), s, ret);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
}

void rot3(in vec3 p, out mat3 rot)
{
    rot = mat3(c.xyyy, cos(p.x), sin(p.x), 0., -sin(p.x), cos(p.x))
        *mat3(cos(p.y), 0., -sin(p.y), c.yxy, sin(p.y), 0., cos(p.y))
        *mat3(cos(p.z), -sin(p.z), 0., sin(p.z), cos(p.z), c.yyyx);
}


vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main_scene(in vec3 x, out vec2 sdf)
{
    float nara;
    mfnoise(x.xy, 5., 2000., .65, nara);

    sdf = vec2(x.z+.4+.001*nara,0.);
    const float size = .2;
    float d = 1.;
    
    mat3 Rx;
    rot3(vec3(1.1,1.3,1.6)*iTime, Rx);
    x = Rx*x;

    vec2 delta = .25*vec2(pi/6., pi/6.),
        xp = vec2(atan(x.y,x.x), acos((x.z)/length(x))),
        dp  = mod(xp,2.*delta)-delta,
        pja = xp-dp;
    float da = 1.;
    for(float i = -1.; i <= 1.; i += 1.)
        for(float j = -1.; j <= 1.; j += 1.)
        {
            vec2 pj = pja + 2.*delta * vec2(i,j);
            vec3 y = .2*vec3(sin(pj.y)*cos(pj.x), sin(pj.y)*sin(pj.x), cos(pj.y));

            mat3 R =
                mat3(cos(pj.y), 0., sin(pj.y), c.yxy, -sin(pj.y), 0., cos(pj.y)) 
                *mat3(cos(pj.x), -sin(pj.x), 0., sin(pj.x), cos(pj.x), c.yyyx) //rite
                ;

            vec3 z = R*(x-y);

    // mat3 Re;
    // rot3(vec3(1.1,1.3,1.6), Re);

            dbox3_wireframe(Rx*z, .05*c.xxx, .003, da);

            float db, dc;
            dbox3(Rx*z,.05*c.xxx, db);
            da = mix(da, db, clamp(iTime-12.010+.25,0.,.5)/.5);
            float co;
            dc = length(z)-.03;
            da = mix(da, dc, clamp(iTime-22.071+.25,0.,.5)/.5);

            rand(pj, co);

            add(sdf, vec2(abs(da)-.001, 3.+co), sdf);

            // dbox3(Rx*z, .04*c.xxx, da);
            da = length(Rx*z)-.025;
            add(sdf, vec2(abs(da)-.001, 4.), sdf);
            // d = min(d,da);
        }

    
    
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
march(march_main, main_scene, false, min(s.x,8.e-3))
march(march_shadow, main_scene, x.z>1., min(s.x,8.e-4))

void palette2(in float scale, out vec3 col)
{
    const int N = 5;
    const vec3 colors[N] = vec3[N](
            vec3(0.35,0.53,0.89),
            vec3(0.40,0.67,0.78),
            vec3(0.10,0.03,0.15),
            vec3(0.45,0.24,0.73),
            vec3(0.85,0.30,0.27)
    );
	float index = floor(scale*float(N)), 
        remainder = scale*float(N)-index;
    col = mix(colors[int(index)],colors[int(index)+1], remainder);
}

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
        col = vec3(.05,.08,.15);
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
        col = vec3(0.18,0.04,0.09);
        col = .7*col
            + .8*col*max(dot(l-x,n),0.)
            + .3*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y >= 3. && s.y < 4.)
    {
        col = mix(vec3(0.91,0.31,0.24), .3*c.xxx, clamp(s.y-3.,0.,1.));
        col = .2*col
            + .3*col*max(dot(l-x,n),0.)
            + .5*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
    else if(s.y == 4.)
    {
        col = .05*c.xxx;
        col = .2*col
            + .3*col*max(dot(l-x,n),0.)
            + .5*col*pow(max(dot(reflect(l-x,n),dir),0.),1.);
    }
}

float a = 1.0;

void dbox210(in vec3 x, in float size, out vec2 sdf)
{
    x /= size;
    
    float d = 1.;
    
    // Big red box    
    dbox3(x, .2*c.xxx, sdf.x);
    sdf.y = 1.;
    
    // Holes
    
    // 2 upper bar
    dbox3(x-.1*c.xyy, vec3(.02,.3,.12), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 2 right bar
    dbox3(x-.05*c.xyy-.1*c.yyx, vec3(.07,.3,.02), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 2 mid bar
    dbox3(x, vec3(.02,.3,.1), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 2 left bar
    dbox3(x+.05*c.xyy+.1*c.yyx, vec3(.07,.3,.02), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 2 dot
    dbox3(x+.1*c.xyy-.1*c.yyx, vec3(.02,.3,.02), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 1 bar
    dbox3(x+.04*c.yyx, vec3(.3,.02,.08), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 1 dot
    dbox3(x-.1*c.yyx, vec3(.3,.02,.02), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    // 0 big stripes
    vec3 y = vec3(x.x, abs(x.y), x.z);
    dbox3(y-.05*c.yxy, vec3(.1,.03,.3), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));

	// 0 small stripes
    dbox3(y-.1*c.yxy-.06*c.xyy, vec3(.08,.021,.3), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));

    // 0 upper/lower stripes
    vec3 z = vec3(abs(x.x), x.yz);
	dbox3(z-.119*c.xyy, vec3(.021,.08,.3), d);
    sdf.x = max(-d, sdf.x);
    sdf.y = mix(sdf.y, 2., step(d, sdf.x));
    
    sdf.x *= size;
}

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

void dbox(in vec2 x, in vec2 b, out float d)
{
    vec2 da = abs(x)-b;
    d = length(max(da,c.yy)) + min(max(da.x,da.y),0.0);
}

void dmercury(in vec2 x, out float d)
{
    d = -1.;
    float da;

    x += .1*c.yx;

    // Upper part
    dbox(x-.35*c.yx,vec2(.4,.35), da);
    d = max(d, -da);
    dbox(x-.7*c.yx, vec2(.2,.2), da);
    d = min(d,da);
    dbox(x-.25*c.yx,vec2(.2,.05),da);
    d = min(d,da);
    
    // Lower part
    dbox(x+.2*c.yx,vec2(.1,.4),da);
    d = max(d, -da);
    dbox(x+.2*c.yx, vec2(.4,.1),da);
    d = max(d, -da);
    
    d = -d;
}

void analytical_sphere(in vec3 o, in vec3 dir, in float R, out vec2 d)
{
    float a = dot(dir,dir),
        b = 2.*dot(o,dir),
        cc = dot(o,o)-R*R,
        dis = b*b-4.*a*cc;
    vec2 dd = (dis<0.)?1.e4*c.xx:(c.xz*sqrt(dis)-b)/2./a;
    d = vec2(min(dd.x, dd.y), max(dd.x, dd.y));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
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
    int N = 1300,
        i;

    t += uv.x * r + uv.y * u;
    dir = normalize(t-o);

    y = o-(o.z-.4)/dir.z*dir;

        float d = 0.,// -(o.z+.1)/dir.z, 
        d0;


    vec2 dnf;
    analytical_sphere(o, dir, .3, dnf);
    if(dnf.x < 1.)
        d = dnf.x;
    else 
        d = -(o.z+.4)/dir.z;
    
    march_main(x, o, d, dir, N, i, s);
    l = vec3(-1.3,.3,1.6);
    l2 = vec3(-1.3,-.3,1.6);
    
//    if(i<N)
    {
        main_normal(x, n, 5.e-5);
        n = round(n);
    }

    
    illuminate(x, n, dir, l, col, s);
    illuminate(x, n, dir, l2, c1, s);
    col = mix(col, c1, .5);
    
    bool isa = false;
    if(s.y == 0.)
    {
        isa = true;
        o0 = x;
        dir0 = reflect(dir, n);
        d0 = .01;
        
        analytical_sphere(o0, dir0, .3, dnf);
        if(dnf.x < 1.)
        

        {
        d0 = dnf.x;
        
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
    
    analytical_sphere(o, dir, .3, dnf);
    if(dnf.x < 1.)
    {
        d = dnf.x;
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
            if(x.z>0.) break;
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
    
    analytical_sphere(o, dir, .3, dnf);
    if(dnf.x < 1.)
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
            if(x.z>0.) break;
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
    
    col = mix(col, c.yyy, smoothstep(.3,1.5,abs(uv.y/.5)));
    // col = mix(col, length(col)/sqrt(3.)*c.xxx, .7);

    // Scan lines
    //col += .8*vec3(0., 0.05, 0.1)*sin(uv.y*1550.);

    float nar, nara;
    mfnoise(y.xy, 4., 2000., .45, nar);
    mfnoise(y.xy, 5., 2000., .65, nara);

    col = mix(col,mix(vec3(0.67,0.13,0.18),vec3(0.06,0.36,0.38),length(y+.2*c.yyx)/.5), smoothstep(.5,-.4,length(y+.2*c.yyx)/.5));
    
    if(isa)
    {
        col = mix(col, mix(col,.02*c.xxx, .3), sm(abs(nar)-.01));
        col = mix(col, mix(col,vec3(0.35,0.47,0.63), .3), sm(abs(nar)-.004));
        col = mix(col, .02*col, abs(nara)-.1);
    }

    col = mix(col, mix(col, 2.*col, .5), sm(min(abs(y.x),abs(2.*y.y))-.21));
    col = mix(col, mix(col, 2.*col, .3), sm(abs(min(abs(y.x),abs(2.*y.y))-.21)-.05));
    col = mix(col, mix(col, .1*col, .3), sm(abs(abs(min(abs(y.x),abs(2.*y.y))-.21)-.05)-.002));

    
    col = mix(col, mix(col, vec3(0.91,0.31,0.24), .3+.1*nar), sm((length(uv)-.4)/115.));
    // col = mix(col, mix(col, vec3(0.38,0.82,0.80), .3), clamp((length(uv)-.5)/.5,0.,1.));

    vec3 hsv = rgb2hsv(col);
    hsv.x = mix(.5,.33, clamp(iTime-22.071+.25,0.,.5)/.5);
    col = mix(col, hsv2rgb(hsv), clamp(iTime-12.010+.25,0.,.5)/.5);

    fragColor = vec4(clamp(col,0.,1.),1.);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}



