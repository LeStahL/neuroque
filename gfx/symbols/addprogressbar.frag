#version 130

const vec3 c = vec3(1.,0.,-1.);

void dbox(in vec2 x, in vec2 b, out float d);

uniform vec2 iResolution;

// #define sm(d) smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d) #CRLF
#define sm(d) smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d)

void addprogressbar(in vec2 uv, inout vec3 col, in vec2 dimensions, in float progress)
{
    float d = 1.;
    
    // Progress bar outline
    dbox(uv, dimensions, d);
    d = abs(d-.001)-.001;
    d = mix(d, 1., step(abs(uv.y),dimensions.y-dimensions.y/20.));
    col = mix(col, c.xxx, sm(d));
    
    // Progress bar value
    float w = dimensions.x-dimensions.y/20.;
    dbox(uv+mix(w,0.,progress)*c.xy, vec2(mix(0.,w,progress),.8*dimensions.y), d);
    col = mix(col, c.xxx, sm(d));
}
