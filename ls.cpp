/* Providence - PC-64k-Intro by Team210 at Vortex 2k19
 * Copyright (C) 2019 Alexander Kraus <nr4@z10.info>
 * Copyright (C) 2019 DaDummy <c.anselm@paindevs.com>
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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#include <stdint.h>

#include "Windows.h"

#include <stdio.h>
#define DEBUG        // Shader debug i/o
#define DEBUG_SHADER // Shader compile and link errors
// #define MIDI // APC40 mkII controls
#define RECORD // Compile in recording capabilities

#define DEMO
#define FUCKING_DEMO

#ifdef MIDI
#include "engine/midi.h"
#endif

int _fltused = 0;

#include "common.h"

#ifdef DEBUG
#include "engine/debug.h"
#endif

// Standard library and CRT rewrite for saving executable size
void *memset(void *ptr, int value, size_t num)
{
    for (int i = num - 1; i >= 0; i--)
        ((unsigned char *)ptr)[i] = value;
    return ptr;
}

size_t strlen(const char *str)
{
    int len = 0;
    while (str[len] != '\0')
        ++len;
    return len;
}

#ifdef MIDI
/*
int btns = 1;
void select_button(int index)
{
    for(int i=0; i<40; ++i)
    {
        DWORD out_msg = 0x8 << 4 | i << 8 | 0 << 16;
        midiOutShortMsg(hMidiOut, out_msg);
    }

    if(index < 40)
    {
        // TODO(ca) Doublecheck if the index is correct!
        jump_to_scene(index + 1);
    }
    
    DWORD out_msg = 0x9 << 4 | index << 8 | btns << 16;
    btns = 1+(btns+1)%125;
    midiOutShortMsg(hMidiOut, out_msg);
}*/
/*
#define NOTE_OFF 0x8
#define NOTE_ON 0x9
#define CONTROL_CHANGE 0xB

#define TIME_DIAL 0x14
#define TIME_FINE_DIAL 0x15
#define TIME_VERYFINE_DIAL 0x16

void CALLBACK MidiInProc_apc40mk2(HMIDIIN hMidiIn, UINT wMsg, DWORD dwInstance, DWORD dwParam1, DWORD dwParam2)
{
    if(wMsg == MIM_DATA)
    {
        BYTE b1 = (dwParam1 >> 24) & 0xFF,
            b2 = (dwParam1 >> 16) & 0xFF,
            b3 = (dwParam1 >> 8) & 0xFF,
            b4 = dwParam1 & 0xFF;
        BYTE b3lo = b3 & 0xF,
            b3hi = (b3 >> 4) & 0xF,
            b4lo = b4 & 0xF,
            b4hi = (b4 >> 4) & 0xF;
        
        BYTE channel = b4lo,
            button = b3;
            
        if(b4hi == NOTE_ON)
        {
            paused = 0;
            
            waveOutReset(hWaveOut);
            select_button(button);
            
            if(button == 0x0)
            {
                header.lpData = smusic1;
                header.dwBufferLength = 4 * music1_size;
                
            }
            else if(button == 0x1)
            {
                int delta = 5. * (double)sample_rate;
                header.lpData = smusic1+delta;
                header.dwBufferLength = 4 * (music1_size-delta);
            }
            else if(button == 0x2)
            {
                int delta = 49.655 * (double)sample_rate;
                header.lpData = smusic1+delta;
                header.dwBufferLength = 4 * (music1_size-delta);
            }
            else if(button == 0x3)
            {
                int delta = 82.76 * (double)sample_rate;
                header.lpData = smusic1+delta;
                header.dwBufferLength = 4 * (music1_size-delta);
            }
            else if(button == 0x4)
            {
                int delta = 99.31 * (double)sample_rate;
                header.lpData = smusic1+delta;
                header.dwBufferLength = 4 * (music1_size-delta);
            }
            else if(button == 0x5)
            {
                int delta = 112. * (double)sample_rate;
                header.lpData = smusic1+delta;
                header.dwBufferLength = 4 * (music1_size-delta);
            }
            
            waveOutPrepareHeader(hWaveOut, &header, sizeof(WAVEHDR));
            waveOutWrite(hWaveOut, &header, sizeof(WAVEHDR));
            waveOutRestart(hWaveOut);
            
        }
        else if(b4hi == NOTE_OFF)
        {
            select_button(button);
            
            // Logo 210
            if(button == 0x59)
            {
                char data[40] = 
                {
                    1,  1,  0,  1,  0,  1,  1,  0,
                    12, 12, 1,  1,  1,  12, 12, 1,
                    0,  0,  1,  1,  1,  0,  0,  1,
                    0,  0,  1,  1,  1,  0,  0,  1,
                    1,  1,  12, 1,  12, 1,  1,  12
                };

                for(int i=0; i<40; ++i)
                {
                    
                    DWORD out_msg;
                    if(data[i] == 0) 
                    {
                        out_msg = 0x8 << 4 | i << 8 | 0 << 16;
                    }
                    else
                    {
                        out_msg = 0x9 << 4 | i << 8 | 1+(data[i]+btns) %125 << 16;
                    }
                    midiOutShortMsg(hMidiOut, out_msg);
                }
                btns = 1+(btns+1)%125;
            }
            // Kewlers Logo
            else if(button == 0x57)
            {
                char data[40] = 
                {
                    3,3,3,3,1,1,1,1,
                    3,3,3,3,1,1,1,1,
                    3,3,3,0,0,1,1,1,
                    0,3,0,0,0,0,1,0,
                    0,7,0,0,0,0,9,0
                };

                for(int i=0; i<40; ++i)
                {
                    
                    DWORD out_msg;
                    if(data[i] == 0) 
                    {
                        out_msg = 0x8 << 4 | i << 8 | 0 << 16;
                    }
                    else
                    {
                        out_msg = 0x9 << 4 | i << 8 | 1+(data[i]+btns) %125 << 16;
                    }
                    midiOutShortMsg(hMidiOut, out_msg);
                }
                btns = 1+(btns+1)%125;
            }
        }
        else if(b4hi == CONTROL_CHANGE)// Channel select
        {
            if(button == TIME_DIAL)
            {
                waveOutReset(hWaveOut);
                time_dial = (double)b2/(double)0x7F;
                
                int delta = (.9*time_dial+.09*time_fine_dial+.01*time_very_fine_dial) * duration * (double)sample_rate;
                header.lpData = min(max(smusic1, smusic1+delta), smusic1+music1_size);
                header.dwBufferLength = 4 * (music1_size-delta);
                waveOutPrepareHeader(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutWrite(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutPause(hWaveOut);
                paused = 1;
            }
            else if(button == TIME_FINE_DIAL)
            {
                waveOutReset(hWaveOut);
                time_fine_dial = (double)b2/(double)0x7F;
                
                int delta = (.9*time_dial+.09*time_fine_dial+.01*time_very_fine_dial) * duration * (double)sample_rate;
                header.lpData = min(max(smusic1, smusic1+delta), smusic1+music1_size);
                header.dwBufferLength = 4 * (music1_size-delta);
                waveOutPrepareHeader(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutWrite(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutPause(hWaveOut);
                paused = 1;
            }
            else if(button == TIME_VERYFINE_DIAL)
            {
                waveOutReset(hWaveOut);
                time_very_fine_dial = (double)b2/(double)0x7F;
                
                int delta = (.9*time_dial+.09*time_fine_dial+.01*time_very_fine_dial) * duration * (double)sample_rate;
                header.lpData = min(max(smusic1, smusic1+delta), smusic1+music1_size);
                header.dwBufferLength = 4 * (music1_size-delta);
                waveOutPrepareHeader(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutWrite(hWaveOut, &header, sizeof(WAVEHDR));
                waveOutPause(hWaveOut);
                paused = 1;
            }
            else
            {
                if(channel == 0 && button == 0x07) fader0 = (double)b2/(double)0x7F;
                else if(channel == 1 && button == 0x07) fader1 = (double)b2/(double)0x7F;
                else if(channel == 2 && button == 0x07) fader2 = (double)b2/(double)0x7F;
                else if(channel == 3 && button == 0x07) fader3 = (double)b2/(double)0x7F;
                else if(channel == 4 && button == 0x07) fader4 = (double)b2/(double)0x7F;
                else if(channel == 5 && button == 0x07) fader5 = (double)b2/(double)0x7F;
                else if(channel == 6 && button == 0x07) fader6 = (double)b2/(double)0x7F;
                else if(channel == 7 && button == 0x07) fader7 = (double)b2/(double)0x7F;
            }
        }

        draw();
        
        printf("wMsg=MIM_DATA, dwParam1=%08x, byte=%02x %02x h_%01x l_%01x %02x, dwParam2=%08x\n", dwParam1, b1, b2, b3hi, b3lo, b4, dwParam2);
    }
    
	return;
}*/
#endif

void create_render_framebuffers()
{
    // Create framebuffer for rendering first pass to
    glGenFramebuffers(1, &first_pass_framebuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, first_pass_framebuffer);
    glGenTextures(1, &first_pass_texture);
    glBindTexture(GL_TEXTURE_2D, first_pass_texture);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, first_pass_texture, 0);
    glDrawBuffer(GL_COLOR_ATTACHMENT0);
}

#define MINIMP3_ONLY_MP3
#define MINIMP3_IMPLEMENTATION
#include <minimp3.h>
#include <minimp3_ex.h>

void load_compressed_sound()
{
    mp3dec_ex_t dec;
    if (mp3dec_ex_open(&dec, "msx/Neuroque.mp3", MP3D_SEEK_TO_SAMPLE))
    {
        printf("failed to decode msx. Will exit\n");
        PostQuitMessage(0);
    }

    music1_size = dec.samples / 2;

    smusic1 = (float *)malloc(dec.samples * sizeof(float));
    size_t read = mp3dec_ex_read(&dec, (mp3d_sample_t *)smusic1, dec.samples);
    if (read != dec.samples) /* normal eof or error condition */
    {
        if (dec.last_error)
        {
            printf("Irgendwas wurde verkackt mit msx.\n");
            PostQuitMessage(0);
        }
    }

    progress += .3 / nblocks1;

    mp3dec_ex_t decs;
    if (mp3dec_ex_open(&decs, "msx/NeuroqueDrumtrackDryFiltered.mp3", MP3D_SEEK_TO_SAMPLE))
    {
        printf("failed to decode dry msx. Will exit\n");
        PostQuitMessage(0);
    }

    drums_raw = (float *)malloc(decs.samples * sizeof(float));
    size_t reads = mp3dec_ex_read(&decs, (mp3d_sample_t *)drums_raw, decs.samples);
    if (reads != decs.samples) /* normal eof or error condition */
    {
        if (decs.last_error)
        {
            printf("Irgendwas wurde verkackt mit dry msx.\n");
            PostQuitMessage(0);
        }
    }

    if (dec.samples != decs.samples)
    {
        printf("Lol alla der fuck drumtrack passt nicht zum track, fix des mal.\n");
        PostQuitMessage(0);
    }

    // Smooth da shit and convert from channels to scale; integrate scale to nbeats
    fixedSize = min(dec.samples, decs.samples);
    scale = (double *)malloc(fixedSize * sizeof(double));
    // nBeats = (double *) malloc(fixedSize*sizeof(double));

    // FILE *f = fopen("INTENSITY.12197", "rb");
    // fseek(f, 0, SEEK_SET);
    // fread(scale, sizeof(double), fixedSize - 1, f);
    // fclose(f);

    // FILE *f = fopen("INTENSITY", "wt");
    for (int i = 0; i < fixedSize; ++i)
    // // printf("%le\n", scale[i]);
    {
        float *sample = smusic1 + i;
        int16_t *left = (int16_t *)sample,
                *right = (int16_t *)(sample + 1);
        double dleft = (double)*left / (double)65535,
               dright = (double)*right / (double)65535;
        // fprintf(f, "%le\n", sqrt(dleft * dleft + dright * dright));
        scale[i] = sqrt(dleft * dleft + dright * dright);
    }

    progress += .3 / nblocks1;
}

#ifdef DEBUG

void load_debug_output()
{
    // Initialize keyboard texture
    glGenTextures(1, (GLuint *)&debug_output_texture_handle);
    glBindTexture(GL_TEXTURE_2D, debug_output_texture_handle);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, debug_texture_size, debug_texture_size, 0, GL_RGBA, GL_UNSIGNED_BYTE, debug_output);
}

#endif

#include "engine/shader.h"
#include "shaders.gen.h"
void load_demo()
{
    printf("++++ Creating Loading bar.\n");
    lInitializeLoader();
#ifdef DEBUG_SHADER
    if (shader_program_gfx_load.linkStatus != GL_TRUE)
    {
        printf("    Linker Error. Log:\n%s\n\n", shader_program_gfx_load.linkerError);
    }
#endif

    printf("++++ Loading bar created.\n");

    create_render_framebuffers();

    updateBar();

    lLoadAllSymbols();
#ifdef DEBUG_SHADER
    for (unsigned int symbolIndex = 0; symbolIndex < lNumberOfSymbols; ++symbolIndex)
    {
        if (shader_symbols[symbolIndex].compileStatus != GL_TRUE)
        {
            printf("    Compiler Error. Log:\n%s\n\n", shader_symbols[symbolIndex].compilerError);
        }
    }
#endif

    lLoadAllPrograms();
#ifdef DEBUG_SHADER
    for (unsigned int programIndex = 0; programIndex < lNumberOfPrograms; ++programIndex)
    {
        if (shader_programs[programIndex].linkStatus != GL_TRUE)
        {
            printf("    Compiler Error. Log:\n%s\n\n", shader_programs[programIndex].linkerError);
        }
    }
#endif

    load_font();

    updateBar();

    load_compressed_sound();
    music_loading = 1;

    updateBar();

    glUseProgram(0);

    initialize_sound();

#ifdef MIDI
    initControllers();
#endif
}

void load_font()
{
    // Initialize font texture
    printf("font texture width is: %d\n", font_texture_size); // TODO: remove
    glGenTextures(1, (GLuint *)&font_texture_handle);
    glBindTexture(GL_TEXTURE_2D, font_texture_handle);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, font_texture_size, font_texture_size, 0, GL_RGBA, GL_UNSIGNED_BYTE, font_texture);

    progress += .1 / NSHADERS;
}

// Pure opengl drawing code, essentially cross-platform
void draw()
{
    // Render scene to buffer
    glBindFramebuffer(GL_FRAMEBUFFER, first_pass_framebuffer);

    t = t_now;
    if (t > t_end)
    {
        ExitProcess(0);
    }

#ifdef MIDI
    if (time_dial != 0 || time_fine_dial != 0 || time_very_fine_dial != 0)
    {
        t = t_now + (.9 * time_dial + .09 * time_fine_dial + .01 * time_very_fine_dial) * duration;
    }
#endif

#include "draw.h"

    quad();

    // Render text to buffer
    glBindFramebuffer(GL_FRAMEBUFFER, first_pass_framebuffer);

#include "text.h"
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, first_pass_texture);

    quad();

    glBindFramebuffer(GL_FRAMEBUFFER, 0);

    // Render post processing to screen
    glUseProgram(shader_program_gfx_post.handle);
    glUniform2f(shader_uniform_gfx_post_iResolution, w, h);
    glUniform1f(shader_uniform_gfx_post_iFSAA, fsaa);
    glUniform1i(shader_uniform_gfx_post_iChannel0, 0);
    glUniform1f(shader_uniform_gfx_post_iTime, t);
    glUniform1f(shader_uniform_gfx_post_iScale, MAX(MIN(scale[index], 1.), 0.));

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, first_pass_texture);
    //     glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, 0);

    quad();

#if !defined DEBUG
    // Render to screen
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
#endif

#ifdef DEBUG
    // glBindFramebuffer(GL_FRAMEBUFFER, 0);

    // glUseProgram(shader_program_gfx_debug.handle);
    // glUniform1i(shader_uniform_gfx_debug_iShowDebugInfo, showDebugWindow);
    // glUniform2f(shader_uniform_gfx_debug_iResolution, w, h);
    // glUniform1f(shader_uniform_gfx_debug_iFontWidth, font_texture_size);
    // glUniform1f(shader_uniform_gfx_debug_iTime, t);
    // glUniform1i(shader_uniform_gfx_debug_iChannel0, 0);
    // glUniform1i(shader_uniform_gfx_debug_iFont, 1);

#ifdef MIDI
//     glUniform1f(shader_uniform_gfx_debug_iFader0, faders[0]);
//     glUniform1f(shader_uniform_gfx_debug_iFader1, faders[1]);
//     glUniform1f(shader_uniform_gfx_debug_iFader2, faders[2]);
//     glUniform1f(shader_uniform_gfx_debug_iFader3, faders[3]);
//     glUniform1f(shader_uniform_gfx_debug_iFader4, faders[4]);
//     glUniform1f(shader_uniform_gfx_debug_iFader5, faders[5]);
//     glUniform1f(shader_uniform_gfx_debug_iFader6, faders[6]);
//     glUniform1f(shader_uniform_gfx_debug_iFader7, faders[7]);
//
//     glUniform1f(shader_uniform_gfx_debug_iDial0, dials[0]);
//     glUniform1f(shader_uniform_gfx_debug_iDial1, dials[1]);
//     glUniform1f(shader_uniform_gfx_debug_iDial2, dials[2]);
//     glUniform1f(shader_uniform_gfx_debug_iDial3, dials[3]);
//     glUniform1f(shader_uniform_gfx_debug_iDial4, dials[4]);
//     glUniform1f(shader_uniform_gfx_debug_iDial5, dials[5]);
//     glUniform1f(shader_uniform_gfx_debug_iDial6, dials[6]);
//     glUniform1f(shader_uniform_gfx_debug_iDial7, dials[7]);
#endif

//     glActiveTexture(GL_TEXTURE0);
//     glBindTexture(GL_TEXTURE_2D, first_pass_texture);
// //     glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, 0);

//     glActiveTexture(GL_TEXTURE1);
//     glBindTexture(GL_TEXTURE_2D, font_texture_handle);
// //     glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, font_texture_size, font_texture_size, 0, GL_RGBA, GL_UNSIGNED_BYTE, 0);

//     quad();
#endif

#if defined RECORD
    // Gen filename
    if (recording)
    {
        char filename[1024];
        sprintf(filename, "%s\\frame%06d.bmp", record_filename, frame);
        screenshot(filename);
    }
#endif

    glBindTexture(GL_TEXTURE_2D, 0);
}
