#version 130

const vec3 c = vec3(1.,0.,-1.);

void hash33(in vec3 p3, out vec3 d);

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
    {
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
}
