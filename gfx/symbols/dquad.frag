#version 130

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d);
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