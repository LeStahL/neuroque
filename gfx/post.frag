/* Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
 * Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
#version 130

uniform float iFSAA;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iTime;
uniform float iScale;
uniform float iNBeats;

out vec4 gl_FragColor;

const vec3 c = vec3(1.,0.,-1.);
const float pi = acos(-1.);

void rand(in vec2 x, out float n);
void lfnoise(in vec2 t, out float n);
void mfnoise(in vec2 x, in float d, in float b, in float e, out float n);
void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d);
float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}
void zextrude(in float z, in float d2d, in float h, out float d);
void smoothmin(in float a, in float b, in float k, out float dst);
void main()
{
    vec2 uv = (gl_FragCoord.xy -.5*iResolution.xy)/iResolution.y;
    vec3 col = c.yyy;

    vec3 c2 =  texture(iChannel0, gl_FragCoord.xy/iResolution.xy).rgb;

    col = c2;
    
    // Add stripes
    // col = mix(col, mix(col,c.yyy,.7), sm(abs(uv.y-.45)-.04));
    
    // grid lines
    vec2 y = mod(uv, .025)-.0125;
    y = abs(y);
    float rr;
    lfnoise(uv-mod(uv, .025)-iTime, rr);
    col = mix(col, mix(c.xxx,c.yyy, sm(min(y.x,y.y))),.1*rr);
    
    // Scan lines
    col += vec3(0., 0.05, 0.1)*sin(uv.y*1050.+ 5.*iTime);
    
    // scale(iTime,iScale);
    // col += .3*col*iScale*step(35.8321,iTime);
    
    gl_FragColor = vec4(clamp(col, 0.,1.), 1.);
}
