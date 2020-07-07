#ifndef TEXT_HEADER
#define TEXT_HEADER    

if(t < t_corona)
{
    glUseProgram(shader_program_gfx_logo210text.handle);
    glUniform1f(shader_uniform_gfx_logo210text_iTime, t-t_logo210);
    glUniform2f(shader_uniform_gfx_logo210text_iResolution, w, h);
    glUniform1i(shader_uniform_gfx_logo210text_iChannel0, 0);
}
else if(t < t_menger)
{
    glUseProgram(shader_program_gfx_coronatext.handle);
    glUniform1f(shader_uniform_gfx_coronatext_iTime, t-t_corona);
    glUniform2f(shader_uniform_gfx_coronatext_iResolution, w, h);
    glUniform1i(shader_uniform_gfx_coronatext_iChannel0, 0);
}
else if(t < t_blockmania)
{
    glUseProgram(shader_program_gfx_mengertext.handle);
    glUniform1f(shader_uniform_gfx_mengertext_iTime, t-t_menger);
    glUniform2f(shader_uniform_gfx_mengertext_iResolution, w, h);
    glUniform1f(shader_uniform_gfx_mengertext_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_menger_iNBeats, nBeats[index]);
    glUniform1i(shader_uniform_gfx_mengertext_iChannel0, 0);
}
else if(t < t_edgysphere)
{
    glUseProgram(shader_program_gfx_blockmaniatext.handle);
    glUniform1f(shader_uniform_gfx_blockmaniatext_iTime, t-t_blockmania);
    glUniform2f(shader_uniform_gfx_blockmaniatext_iResolution, w, h);
    glUniform1f(shader_uniform_gfx_blockmaniatext_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_blockmania_iNBeats, nBeats[index]);
    glUniform1i(shader_uniform_gfx_blockmaniatext_iChannel0, 0);
}
else if(t < t_tentacles)
{
    glUseProgram(shader_program_gfx_edgyspheretext.handle);
    glUniform1f(shader_uniform_gfx_edgyspheretext_iTime, t-t_edgysphere);
    glUniform2f(shader_uniform_gfx_edgyspheretext_iResolution, w, h);
    glUniform1f(shader_uniform_gfx_edgyspheretext_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_edgysphere_iNBeats, nBeats[index]);
    glUniform1i(shader_uniform_gfx_edgyspheretext_iChannel0, 0);
}
else {
    glUseProgram(shader_program_gfx_tentaclestext.handle);
    glUniform1f(shader_uniform_gfx_tentaclestext_iTime, t-t_tentacles);
    glUniform2f(shader_uniform_gfx_tentaclestext_iResolution, w, h);
    glUniform1f(shader_uniform_gfx_tentaclestext_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_tentacles_iNBeats, nBeats[index]);
    glUniform1i(shader_uniform_gfx_tentaclestext_iChannel0, 0);
}   
#endif