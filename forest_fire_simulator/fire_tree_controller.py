#Please run this file

#Amon Otsuki
from forest_fire_graphics import *
from forest_fire_process import *
from forest_fire_class import *


def main():
    win = init_window_GUI()
    entry_box = create_entry_box(win)
    start_button = createButton(win, Point(110, 43), Point(150, 48), "white", "Click to Start", 14, "black")
    regrow_button = createButton(win, Point(110, 36), Point(150, 41), "white", "Regrow the Forest", 14, "black")
    exit_button = createButton(win, Point(110, 25), Point(150, 30), "white", "Exit", 14, "black")
    create_messsage_box(win, Point(110, 75), Point(150, 100), "white")

    forest_area = Rectangle(Point(0, 0), Point(100, 100))
    num_of_rows = 15
    num_of_cols = 15
    forest = Forest(win, forest_area, num_of_rows, num_of_cols)

    done = False
    while not done:
        message1, message2, message3 = initialize_instruction(win)
        start_button_clicked = False
        fire_initialized = False
        while not (start_button_clicked and fire_initialized): #Set initial tree(s). As start button is clicked, start simulation!
            start_button_clicked = False
            click = win.getMouse()

            if is_clicked(start_button, click):
                try:
                    rate_of_fire_spread = float(entry_box.getText()) / 100
                    start_button_clicked = True
                    message1.undraw()
                    message1 = Text(Point(130.5, 90), "☑ Enter a fire spreading rate".ljust(35))
                    message1.setTextColor("grey")
                    message1.draw(win)
                except:
                    message1.undraw()
                    message1 = Text(Point(130.5, 90), "☐ Enter a fire spreading rate".ljust(35))
                    message1.setTextColor("red")
                    message1.draw(win)

            clicked_tree = forest.find_clicked_tree(click)
            if clicked_tree is not None:
                forest.light_fire_at(clicked_tree) #Change the tree obj's state to the next one
                print(clicked_tree)
                print(forest.get_state_at(clicked_tree))
                fire_initialized = True
                message2.undraw()
                message2 = Text(Point(130, 85), "☑ Click on the trees to light fire")
                message2.setTextColor("grey")
                message2.draw(win)
                start_button_clicked = False
        message1.undraw()
        message2.undraw()
        message3.draw(win)

        #Create a fire monitor from the current forest
        fire_monitor = Fire_monitor(forest) #Dictionary
        fire_extinguished = False
        while not fire_extinguished: #Change condition
            fire_monitor.update_data()
            current_fire_locations = fire_monitor.get_trees_on_fire()

            # Trees on fire proceed to the next state
            forest.burn_trees_on_fire()

            #Determine where the fire spreads next based on the locations that are currently on fire.
            locations_to_catch_fire = []
            for location in current_fire_locations:
                locations_to_catch_fire += get_next_fire_locations(locations_to_catch_fire, rate_of_fire_spread, location, num_of_rows, num_of_cols)

            #Light fire at next fire locations
            for location in locations_to_catch_fire:
                if fire_monitor.get_state_at(location) == "normal":
                    forest.light_fire_at(location)

            #Set the flag to false once all the trees are extinguished
            if len(current_fire_locations) == 0:
                fire_extinguished = True

        #Display result message
        burnt_trees = fire_monitor.get_burnt_trees()
        damage_percentage = len(burnt_trees) / (num_of_rows * num_of_cols)
        result_message = display_result_GUI(win, damage_percentage)
        message3.undraw()

        click = win.getMouse()
        while not(is_clicked(regrow_button, click) or is_clicked(exit_button, click)):
            click = win.getMouse()

        if is_clicked(regrow_button, click):
            forest.regrow()
        elif is_clicked(exit_button, click):
            done = True

        result_message.undraw()
main()

