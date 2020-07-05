const float pi = acos(-1.);
const vec3 c = vec3(1.,0.,-1.);

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d);

vec2 pj(in vec2 x, in int j, in float N)
{
    float p = float(j)*2.*pi/N;
    return vec2(cos(p), sin(p));
}

// iq's smooth minimum
void smoothmin(in float a, in float b, in float k, out float dst);

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