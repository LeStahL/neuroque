uniform float iTime;
uniform vec2 iResolution;


const float pi = acos(-1.);
const vec3 c = vec3(1.,0.,-1.);

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

//distance to spline with parameter t
float dist2(vec2 p0,vec2 p1,vec2 p2,vec2 x,float t)
{
    t = clamp(t, 0., 1.);
    return length(x-pow(1.-t,2.)*p0-2.*(1.-t)*t*p1-t*t*p2);
}

//minimum dist3ance to spline
void dspline2(in vec2 x, in vec2 p0, in vec2 p1, in vec2 p2, out float ds)
{
    //coefficients for 0 = t^3 + a * t^2 + b * t + c
    vec2 E = x-p0, F = p2-2.*p1+p0, G = p1-p0;
    vec3 ai = vec3(3.*dot(G,F), 2.*dot(G,G)-dot(E,F), -dot(E,G))/dot(F,F);

	//discriminant and helpers
    float tau = ai.x/3., p = ai.y-tau*ai.x, q = - tau*(tau*tau+p)+ai.z, dis = q*q/4.+p*p*p/27.;
    
    //triple real root
    if(dis > 0.) 
    {
        vec2 ki = -.5*q*c.xx+sqrt(dis)*c.xz, ui = sign(ki)*pow(abs(ki), c.xx/3.);
        ds = dist2(p0,p1,p2,x,ui.x+ui.y-tau);
        return;
    }
    
    //three dist3inct real roots
    float fac = sqrt(-4./3.*p), arg = acos(-.5*q*sqrt(-27./p/p/p))/3.;
    vec3 t = c.zxz*fac*cos(arg*c.xxx+c*pi/3.)-tau;
    ds = min(
        dist2(p0,p1,p2,x, t.x),
        min(
            dist2(p0,p1,p2,x,t.y),
            dist2(p0,p1,p2,x,t.z)
        )
    );
}

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

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


void dbox3(in vec3 x, in vec3 b, out float d)
{
  vec3 da = abs(x) - b;
  d = length(max(da,0.0))
         + min(max(da.x,max(da.y,da.z)),0.0);
}

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
    dlinesegment(uv*a, p0, p1, d);

    float da;
    if(iTime < 12.688)
	    dbox210_plane(uv, 1., da);
    else 
    {
        dnovoque(.7*uv, da);
        da /= .7;
        da = abs(da)-.02;
    }
    d = mix(d, da, .97);
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
    vec3 c1 = .7*mix(vec3(0.18,0.16,0.15), vec3(0.03,0.09,0.28), clamp(iTime-7.661+.25, 0., 1.)/.5),
        c2 = .7*mix(vec3(0.91,0.30,0.24), vec3(0.21,0.30,0.94), clamp(iTime-7.661+.25,0.,1.)/.5);
    for(float i=0.; i<200.; i+=1.)
    {
        float f, f0;
        lfnoise(6.*uv+.01*i*c.xx-2.3*iTime, f);
        
        f = f*.1;//+uv.x*2.;
        f = mix(0., f, clamp(1.-i/1000.,0.,1.));
        mat2 R = mat2(cos(f), sin(f), -sin(f), cos(f));
        spline_ifs(R*(uv-.0002*i),.01*i,d);
        mfnoise(i*c.xx-f-iTime, 3.,1000., .25, f0);
        f0 = mix(0., f0, clamp(1.-i/1000.,0.,1.));
	    col = mix(col, mix(c1, c2,.5-.5*f), mix(f*mix(.01,.02,.5+.5*f-f0)*sm((abs(d)-.0005)/16./(15.5+.5*f)), sm(abs(d)-.0005), .06));
	    col = mix(col, mix(2.*c1, 2.*c2, .5+.5*f), mix(abs(f)*.2*sm((abs(abs(d)-.0005)-.0001)/2./(15.5+.5*f)), sm(abs(d-.0005)-.0001), .06));
    }
    col = 2.*col + 2.*col * col + 3.* col * col * col;

    float da;
    if(iTime < 12.688)
	    dbox210_plane(uv, 1., da);
    else 
    {
        dnovoque(.7*uv, da);
        da /= .7;
        da = abs(da)-.02;
    }
    // d = mix(d, da, clamp(1.-i/100.,0.,1.));
    col = mix(col, .6*mix(col, length(col)/sqrt(3.)*c.xxx, .5), sm(da));

    col = mix(c.yyy, col, clamp(iTime-3.367+.25, 0., 1.)/.5);

    fragColor = vec4(clamp(col,0.,1.),1.0);
}


void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}