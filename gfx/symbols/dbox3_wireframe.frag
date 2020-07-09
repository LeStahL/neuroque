#version 130

const vec3 c = vec3(1.,0.,-1.);

void dbox3(in vec3 x, in vec3 b, out float d);

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