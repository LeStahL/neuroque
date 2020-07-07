/* Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
 * Copyright (C) 2019 DaDummy <c.anselm@paindevs.com>
 * Copyright (C) 2019 Alexander Kraus <nr4@z10.info>
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

#ifndef COMMON_H
#define COMMON_H


const char *demoname = "Corona";

#include "config.h"
#include "engine/renderer.h"
#include "engine/shader.h"
#include "engine/loader.h"
#include "scenes.h"
#include "engine/orchestrator.h"

#include <stddef.h>

#define FALSE (0)
#define TRUE (1)
#define ABS(x) ((x)<0?(-x):(x))
#define sign(x) ((x)<0?-1.:1.)

#ifdef WIN32
#	define WIN32_LEAN_AND_MEAN
#	define VC_EXTRALEAN
#	include <windows.h>
#   include <Windowsx.h>
#	include <commctrl.h>
#	include <mmsystem.h>
#	include <Mmreg.h>
#   include <vfw.h>
#endif

#include <GL/gl.h>
#include <glext.h>


#define clamp(x, minimum, maximum) min(max(x, minimum), maximum)

#ifdef DEBUG
#include <stdio.h>
#include <stdlib.h>

// TODO: remove below
void debug(int shader_handle)
{
	printf("    Debugging shader with handle %d.\n", shader_handle);
	int compile_status = 0;
	glGetShaderiv(shader_handle, GL_COMPILE_STATUS, &compile_status);
	if(compile_status != GL_TRUE)
	{
		printf("    FAILED.\n");
		GLint len;
		glGetShaderiv(shader_handle, GL_INFO_LOG_LENGTH, &len);
		printf("    Log length: %d\n", len);
		GLchar *CompileLog = (GLchar*)malloc(len*sizeof(GLchar));
		glGetShaderInfoLog(shader_handle, len, NULL, CompileLog);
		printf("    Error messages:\n%s\n", CompileLog);
		free(CompileLog);
	}
	else
		printf("    Shader compilation successful.\n");
}

void debugp(int program)
{
	printf("    Debugging program with handle %d.\n", program);
	int compile_status = 0;
	glGetProgramiv(program, GL_LINK_STATUS, &compile_status);
	if(compile_status != GL_TRUE)
	{
		printf("    FAILED.\n");
		GLint len;
		glGetProgramiv(program, GL_INFO_LOG_LENGTH, &len);
		printf("    Log length: %d\n", len);
		GLchar *CompileLog = (GLchar*)malloc(len*sizeof(GLchar));
		glGetProgramInfoLog(program, len, NULL, CompileLog);
		printf("    Error messages:\n%s\n", CompileLog);
		free(CompileLog);
	}
	else
		printf("    Program linking successful.\n");
}
#else // DEBUG
#define printf(a)
#endif //DEBUG


#ifndef MINIFY_64K
// Export symbols that make hybrid graphics systems (laptops) use the dedicated GPU
__declspec(dllexport) unsigned long NvOptimusEnablement = 1;
__declspec(dllexport) int AmdPowerXpressRequestHighPerformance = 1;
#endif


// Supported resolutions
int selectedIndex = 0,
    nresolutions = 0,
    *widths = 0,
    *heights = 0,
    *rates = 0,
    nuniqueresolutions = 0;

// Supported FSAA entries;
const int nfsaa = 6;
const char *fsaa_names[] =
{
    "1x (None)",
    "4x",
    "9x",
    "16x",
    "25x",
    "36x"
};

const int nbuffersizes = 4;
const char *buffersize_names[] = 
{
    "128x128 px",
    "256x256 px",
    "512x512 px",
    "1024x1024 px"
};

int    
    // SFX
    sfx_program,
    sfx_handle,
    sfx_blockoffset_location,
    sfx_samplerate_location,
    sfx_volumelocation,
    sfx_texs_location,
    sfx_sequence_texture_location,
    sfx_sequence_width_location,

    // Sequence
    sequence_texture_handle,

    // Antialiasing
    fsaa = 36,
    txaa = 1,

#ifdef DEBUG
    debug_output_texture_handle,
    debug_texture_size,
#endif
    
	// Text
	font_texture_handle;

char debug_output[1024];

// Demo globals
double t
#ifdef MIDI
    ,
    time_dial = 0.,
    time_fine_dial = 0.,
    time_very_fine_dial = 0.,
    fader0 = 0,
    fader1 = 0,
    fader2 = 0,
    fader3 = 0,
    fader4 = 0,
    fader5 = 0,
    fader6 = 0,
    fader7 = 0
#endif
    ;

unsigned int loading = 1, music_loading = 0;
int music_block = 0;
unsigned int snd_framebuffer;
unsigned int start_at_scene = 0;

// Music shader globals
int sample_rate = 44100, channels = 2;
double duration1 = duration; //3 min running time
float *smusic1,
    *drums_raw;
double *scale,
    *nBeats;
int music1_size;
float texs = 512;
int block_size = 512 * 512,
nblocks1;
unsigned int paused = 0, 
    recording = 0,
    muted = 0;
char record_filename[1024];

double t_paused;

GLuint first_pass_framebuffer = 0, first_pass_texture;
GLenum error;
#define NSHADERS 4.

float t_load_end = 0.;

void load_demo();
void load_font();
void quad();
void updateBar();
void draw();
void jump_to_scene(unsigned int scene_index);

#include "sequence.h"

#include "sfx.h"
#define SFX_VAR_IVOLUME "iVolume"
#define SFX_VAR_ISAMPLERATE "iSampleRate"
#define SFX_VAR_IBLOCKOFFSET "iBlockOffset"
#define SFX_VAR_ITEXSIZE "iTexSize"
#define SFX_VAR_ISEQUENCE "iSequence"
#define SFX_VAR_ISEQUENCEWIDTH "iSequenceWidth"

#include "font/font.h"

#ifdef WIN32
#	include "pal_win32.h"
#else
#	include "pal_linux.h"
#endif

#endif
