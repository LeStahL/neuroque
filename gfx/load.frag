#version 130

uniform vec2 iResolution;
uniform float iProgress;

out vec4 gl_FragColor;

const float pi = acos(-1.);
const vec3 c = vec3(1.,0.,-1.);

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

// Distance to quad
void dquad(in vec2 x, in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p3, out float ret)
{
    vec2 pts[4] = vec2[4](p0,p1,p2,p3);
	float n = 0., ls;
    ret = 1.;
    
    for(int i=0; i<4; ++i)
    {
        int ip1 = int(mod(float(i+1), float(4)));
        vec2 k = x-pts[i], d = pts[ip1]-pts[i];
        
        float beta = k.y/d.y,
            alpha = d.x*k.y/d.y-k.x;
        
        n += step(0., beta)*step(beta, 1.)*step(0., alpha);
        dlinesegment(x, pts[i], pts[ip1], ls);
        ret = min(ret, ls);
    }
    
    ret = mix(ret, -ret, mod(n, 2.));
}

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec3 col = c.yyy;
	float d;
    const float barsize = .05,
        nbars = 24.;
    float blocked_progress = floor(iProgress*nbars)/nbars;
    
    // Gloss
    float phi = atan(uv.y,uv.x+.5-blocked_progress);
    //d = length(uv-vec2(-.5+blocked_progress, 0.))-.03+.02*abs(cos(4.*phi));
    d = abs(uv.y)-.001;
    //d = min(d, abs(uv.x+.5-blocked_progress)-.001);
    col = mix(col, vec3(1.00,0.34,0.17), sm((d-.01)/52.));
    col = mix(col, vec3(1.00,0.97,0.63), sm((d)/2.));
    
    // Dekorationsgeraffel
    vec2 y = c.zx*vec2(sign(uv.y)*uv.x,-abs(uv.y));
    dquad(y, vec2(-.405,-barsize*.5), vec2(-.355,barsize*.5-.1), vec2(.155,barsize*.5-.1), vec2(.205,-barsize*.5), d);
    col = mix(col, mix(.2*c.xxx, .5*c.xxx, clamp(abs(abs(uv.y)/barsize*.5), 0., 1.)), sm(d));
    col = mix(col, .5*c.xxx, sm(abs(d)-.002));
    col = mix(col, .8*c.xxx, sm(abs(d)-.001));
    
    // Shadow lol broken
    dquad(y+.005*c.yx, vec2(-.355,-barsize*.5), vec2(-.337,barsize*.5-.07), vec2(.137,barsize*.5-.07), vec2(.155,-barsize*.5), d);
    col = mix(col, .2*c.xxx, sm(d));
    
    // Gelbes Geraffel
    dquad(y, vec2(-.355,-barsize*.5), vec2(-.337,barsize*.5-.07), vec2(.137,barsize*.5-.07), vec2(.155,-barsize*.5), d);
    col = mix(col, mix(mix(vec3(0.96,0.24,0.11),mix(vec3(0.62,0.09,0.51), vec3(.5,.03,.08), step(uv.y,0.)), clamp(abs((y.y-barsize*.5+.07)/barsize/.44), 0., 1.)), vec3(1.00,0.76,0.61), sm((abs(y.y-barsize*.5+.07)-.001)/4.)), sm(d));
    
    
    // Actual progress bar
    dquad(uv, vec2(-.505,-barsize*.5), vec2(-.505,barsize*.5), vec2(.505,barsize*.5), vec2(.505,-barsize*.5), d);
    col = mix(col, c.yyy, sm(d-.002));
    col = mix(col, mix(.2*c.xxx, .5*c.xxx, clamp(abs(uv.y/barsize*.5), 0., 1.)), sm(d));
    col = mix(col, .5*c.xxx, sm(abs(d)-.002));
    col = mix(col, .8*c.xxx, sm(abs(d)-.001));
    y = vec2(mod(uv.x, 1./nbars)-.5/nbars, uv.y);
    vec2 yi = (uv-y)*nbars;
 	if(yi.x > -.5*nbars && uv.x-y.x < blocked_progress-.5)
    {
	    dquad(y, .44/nbars*c.zz, .44/nbars*c.zx, .44/nbars*c.xx, .44/nbars*c.xz, d);
    	col = mix(col, mix(mix(vec3(0.96,0.24,0.11), mix(vec3(0.62,0.09,0.51), vec3(.5,.03,.08), step(uv.y,0.)), clamp(abs(y.y/barsize/.44), 0., 1.)), vec3(1.00,0.76,0.61), sm((abs(y.y)-.001)/4.)), sm(d));
    }
    
    col = .5*col + col*col;
    
    fragColor = vec4(clamp(col,0.,1.),1.0);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
