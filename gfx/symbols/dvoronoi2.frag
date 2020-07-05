#version 130

const vec3 c = vec3(1.,0.,-1.);

void hash22(in vec2 p3, out vec2 d);

void voronoi_controlpoint2(in vec2 x, out vec2 xv)
{
    float d, dm = 1.e5;
    vec2 p, dp, y = floor(x);
    
    for(float i=-2.; i<2.; i+=1.)
    {
        for(float j=-2.; j<2.; j+=1.)
        {
            p = y + vec2(i,j);
            hash22(1.e2*p, dp);
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

void dvoronoi2(in vec2 x, out float d, out vec2 p, out float control_distance)
{
    d = 1.e4;
    vec2 y,
        dp;
    
    voronoi_controlpoint2(x, p);
    y = floor(p);
    
    control_distance = 1.e4;
    
    for(float i=-2.; i<2.; i+=1.)
    {
        for(float j=-2.; j<2.; j+=1.)
        {
            if(i==0. && j==0.) continue;
            hash22(1.e2*(y+vec3(i,j,k)), dp);
            dp += y+vec3(i,j,k);
            vec2 o = p - dp;
            float l = length(o);
            d = min(d,abs(.5*l-dot(x-dp,o)/l));
            control_distance = min(control_distance,.5*l);
        }
    }
}
