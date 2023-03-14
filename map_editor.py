import pygame
import pygame_gui

import json
import os

pygame.init()

pygame.display.set_caption('Webren map editor')
window_surface = pygame.display.set_mode((1280, 768))

background = pygame.Surface((1280, 768))
background.fill(pygame.Color('#000000'))

clock = pygame.time.Clock()
manager = pygame_gui.UIManager((1280, 768))

# ui

new_map_button = pygame_gui.elements.UIButton(relative_rect=pygame.Rect((15, 15), (150, 25)),
                                            text='create new map',
                                            manager=manager)
save_map_button = pygame_gui.elements.UIButton(relative_rect=pygame.Rect((175, 15), (100, 25)),
                                            text='save map',
                                            manager=manager)

selected_paint = ''

# paint
paint_water = pygame_gui.elements.UIButton(relative_rect=pygame.Rect((300, 15), (75, 25)),
                                            text='water',
                                            manager=manager)
paint_grass = pygame_gui.elements.UIButton(relative_rect=pygame.Rect((385, 15), (75, 25)),
                                            text='grass',
                                            manager=manager)
paint_stone = pygame_gui.elements.UIButton(relative_rect=pygame.Rect((470, 15), (75, 25)),
                                            text='stone',
                                            manager=manager)

is_running = True

bsize = 8
w = 64
h = 64
map_arr = []
map_ren = []

selected_paint = 'water_block'

def new_map():
    return [['water_block'] * w for i in range(h)]

class RenderedRect():
    def __init__(self, x, y, rect, color) -> None:
        self.x = x
        self.y = y
        self.rect: pygame.Rect = rect
        self.color: tuple(int, int, int) = color

def render_map():
    global room
    map_ren.clear()
    for x in range(w):
        for y in range(h):
            color = (0, 0, 0)
            rect = pygame.Rect(x * bsize + 25, y * bsize + 50, bsize, bsize)
            if map_arr[x][y] == 'water_block':
                color = (50, 50, 200)
            elif map_arr[x][y] == 'grass_block':
                color = (50, 200, 50)
            elif map_arr[x][y] == 'stone_block':
                color = (50, 50, 50)
            r = RenderedRect(x, y, rect, color)
            map_ren.append(r)
            #print("Generated room at {0} | {1} -> {2}".format(str(x), str(y), str(color)))

mouse_pressed = False
on_map = False

while is_running:
    time_delta = clock.tick(60)/1000.0

    # mouse check
    mouse_pos = list(pygame.mouse.get_pos())
    if mouse_pos[1] > 50: on_map = True
    else: on_map = False

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            is_running = False
        
        if event.type == pygame_gui.UI_BUTTON_PRESSED:
            if event.ui_element == new_map_button:
                w = int(input("map width: "))
                h = int(input("map height: "))
                bsize = int(input("block size: "))
                map_arr = new_map()
                render_map()
            if event.ui_element == save_map_button:
                name = str(input("file name: "))
                data = {
                    "name": name,
                    "data": map_arr
                }
                json_string = json.dumps(data)
                with open(os.path.join('maps', name + '.json'), 'w') as f:
                    f.write(json_string)

            if event.ui_element == paint_water:
                selected_paint = 'water_block'
            if event.ui_element == paint_grass:
                selected_paint = 'grass_block'
            if event.ui_element == paint_stone:
                selected_paint = 'stone_block'

        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pressed = True
        if event.type == pygame.MOUSEBUTTONUP:
            mouse_pressed = False
        
        manager.process_events(event)

    if mouse_pressed and on_map:
        for block in map_ren:
            mouse_pos = pygame.mouse.get_pos()
            if block.rect.collidepoint(mouse_pos):
                map_arr[block.x][block.y] = selected_paint
                render_map()


    manager.update(time_delta)

    window_surface.blit(background, (0, 0))
    manager.draw_ui(window_surface)

    for rr in map_ren:
        pygame.draw.rect(window_surface, rr.color, rr.rect, 0)

    pygame.display.update()