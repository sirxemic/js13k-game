export const TILE_SIZE = 8

export const TAG_IS_SOLID = 1
export const TAG_IS_DEATH = 2
export const TAG_IS_COLLECTIBLE = 4

// Colors
export const COLOR_BG_LAYER_1 = '#eeeeee'
export const COLOR_BG_LAYER_2 = '#b2b2b3'
export const COLOR_BG_LAYER_3 = '#7b7681'
export const COLOR_FG_LAYER = '#302234'

// Input
export const LEFT_DIRECTION = 1
export const UP_DIRECTION = 2
export const RIGHT_DIRECTION = 4
export const DOWN_DIRECTION = 8
export const BOOST_TOGGLE = 16
export const JUMP_OR_DASH = 32

// Player movement constants
export const DASH_PREPARATION_TIME = 0.1
export const DASH_DURATION = 0.25
export const DASH_UP_SPEED = 240
export const DASH_DOWN_SPEED = 320
export const DASH_HORIZONTAL_SPEED = 240
export const DASH_DIAGONAL_SPEED_X = 170
export const DASH_DIAGONAL_SPEED_Y = 170

export const DASH_FLOATING_DURATION = 0.08

export const RUN_SPEED_HORIZONTAL = 160
export const AIR_ACC_MULTIPLIER = 0.5
export const RUN_ACCELERATION = 800
export const RUN_BOOST_FRACTION = 0.1

export const JUMP_SPEED = 128
export const JUMP_FIRST_PHASE_DURATION = 0.4
export const JUMP_FIRST_PHASE_GRAVITY = 160
export const DEFAULT_GRAVITY = 720

export const MAX_FALLING_SPEED = 320

// Serialization
export const ENTITY_SERIALIZE_ID_SOLID_TILE = 1
export const ENTITY_SERIALIZE_ID_HURT_TILE = 2
export const ENTITY_SERIALIZE_ID_PLAYER_START = 3
export const ENTITY_SERIALIZE_ID_MOVING_PLATFORM = 4
export const ENTITY_SERIALIZE_ID_GOAL = 5
export const ENTITY_SERIALIZE_ID_TEXT = 6