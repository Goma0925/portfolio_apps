from graphics import *
from forest_fire_graphics import *
import numpy as np
import time

class Tree:
    def __init__(self, win, anchor_point):
        """
        :param win:
        :param anchor_point: Location on window. Where the tree is drawn.
        """
        self.__win = win
        self.__anchor = anchor_point
        self.__state = "normal"
        self.__image_previous = "Not set yet"
        self.__image_current = Image(anchor_point, "Images/big_tree.gif")
        self.__image_current.draw(win)
        self.__bounding_box = Rectangle(Point(self.__anchor.x - 3, self.__anchor.y - 3), Point(self.__anchor.x + 3, self.__anchor.y + 3))
        #self.__bounding_box.draw(win)

    def burn_more(self):
        """
        :Change the state of the tree to the next state and change its image.:
        """
        if self.__state == "normal":
            self.__state = "little burn"
            self.__image_previous = self.__image_current
            self.__image_current = Image(self.__anchor, "Images/big_little_burn.gif")
            self.__image_current.draw(self.__win)
            self.__image_previous.undraw()

        elif self.__state == "little burn":
            self.__state = "lot burn"
            self.__image_previous = self.__image_current
            self.__image_current = Image(self.__anchor, "Images/big_lot_burn.gif")
            self.__image_current.draw(self.__win)
            self.__image_previous.undraw()

        elif self.__state == "lot burn":
            self.__state = "charcoal"
            self.__image_previous = self.__image_current
            self.__image_current = Image(self.__anchor, "Images/big_charcoal.gif")
            self.__image_current.draw(self.__win)
            self.__image_previous.undraw()


    def regrow(self):
        """
        :return: Reset the state to normal and change the image to an unburnt tree.
        """
        self.__state = "normal"
        self.__image_previous = self.__image_current
        self.__image_current = Image(self.__anchor, "Images/big_tree.gif")
        self.__image_current.draw(self.__win)
        self.__image_previous.undraw()

    def undraw(self):
        self.__image.undraw()

    def get_bounding_box(self):
        """
        :return: A rectangle obj to check if the tree is clicked.
        """
        return self.__bounding_box

    def get_state(self):
        return self.__state

    def locate(self):
        """
        :Void: For debugging.
        """
        self.__bounding_box.setFill("red")


class Forest:

    def __init__(self, win, Rectangle, num_of_rows, num_of_cols):
        """
        :param Rectangle: Area to draw a forest. A Rectangle() object.
        :param num_of_row: Number of rows
        :param num_of_col: Number of columns
        """
        tree_list = []
        p1 = Rectangle.getP1()
        p2 = Rectangle.getP2()
        if p1.x > p2.x:
            higher_x_bound = p1.x
            lower_x_bound = p2.x
        elif p1.x < p2.x:
            higher_x_bound = p2.x
            lower_x_bound = p1.x
        if p1.y > p2.y:
            higher_y_bound = p1.y
            lower_y_bound = p2.y
        elif p1.y < p2.y:
            higher_y_bound = p2.y
            lower_y_bound = p1.y

        y_tick_interval = ((higher_y_bound - lower_y_bound)/num_of_rows)
        x_tick_interval = ((higher_x_bound - lower_x_bound) / num_of_cols)

        for y in np.arange(higher_y_bound - (y_tick_interval/2), lower_y_bound, -y_tick_interval):
            row = []
            for x in np.arange(lower_x_bound + (x_tick_interval/2), higher_x_bound, x_tick_interval):
                row.append(Tree(win, Point(x,y)))
            row = tuple(row)
            tree_list.append(row)
        tree_tuple = tuple(tree_list)

        self.__trees = tree_tuple

    def erase_all(self):
        for row in self.__trees:
            for tree in row:
                tree.undraw()

    def get_forest_list(self):
        return self.__trees


    def get_tree(self, location):
         """
         :param location: A tuple of location :(row, column). Index starts with 0.
                            ex) First row(top), second column from the left = (0, 1)
        :return: A corresponding tree of the Forest obj.
         """
         row = location[0]
         col = location[1]
         return self.__trees[row][col]

    def light_fire_at(self, tuple):
        row = tuple[0]
        col = tuple[1]
        self.__trees[row][col].burn_more()

    def burn_trees_on_fire(self):
        """
        :Void: Excute .burn_more method for every tree that is already on fire.
        """
        for row in self.__trees:
            for tree in row:
                if tree.get_state() == "little burn" or tree.get_state() == "lot burn":
                    tree.burn_more()

    def regrow(self):
        for row in self.__trees:
            for tree in row:
                if tree.get_state() == "little burn" or tree.get_state() == "lot burn" or tree.get_state() == "charcoal":
                    tree.regrow()

    def get_state_at(self, tuple):
        """
        :param tuple: A location of the tree
        :return: The state of the tree in str
        """
        row = tuple[0]
        col = tuple[1]
        return self.__trees[row][col].get_state()


    def find_clicked_tree(self, click):
        """
        :param click: Point obj
        :return: location of the tree in tuple
        """
        for row_index in range(len(self.__trees)):
            row = self.__trees[row_index]
            for col_index in range(len(row)):
                bounding_box = self.__trees[row_index][col_index].get_bounding_box()
                if is_clicked(bounding_box, click):
                    location = (row_index, col_index)
                    return location
        else:
            return None

    def test_locate(self, row, column):
        tree = self.__trees[row][column]
        tree.__bounding_box.setFill("red")


class Fire_monitor():
    """
    Keeps track of the location of each tree and its state.
    """
    def __init__(self, forest):
        self.__forest = forest
        self.__fire_monitor = {} #Key = (row, col): Value = state of fire. Location & State of the tree.

        forest_list = forest.get_forest_list()
        for row in range(len(forest_list)):
            for col in range(len(forest_list[row])):
                location = (row, col)
                tree = forest.get_tree(location)
                state = tree.get_state()
                coordinate = (row, col)
                self.__fire_monitor[coordinate] = state

    def update_data(self):
        """
        :return: Load the current state of all the trees and update the fire monitor attribute
        """
        self.__fire_monitor = {}  # Key = (row, col): Value = state of fire
        forest_list = self.__forest.get_forest_list()

        for row in range(len(forest_list)):
            for col in range(len(forest_list[row])):
                location = (row, col)
                tree = self.__forest.get_tree(location)
                state = tree.get_state()
                self.__fire_monitor[location] = state

    def get_fire_monitor(self):
        return self.__fire_monitor

    def get_state_at(self, location):
        """
        :param location: A tuple of a tree location
        :return: the state of the tree
        """
        #if type(location) == tuple:
        return self.__fire_monitor[location]
        #else:
            #print("Error: Location must be a tuple - .get_state_at()")

    def get_trees_on_fire(self):
        """
        :return: Return a list of locations(tuple) of trees that are on fire
        """
        trees_on_fire = []
        for location in self.__fire_monitor:
            if self.__fire_monitor[location] == "lot burn" or self.__fire_monitor[location] == "little burn":
                trees_on_fire.append(location)
        return trees_on_fire

    def get_burnt_trees(self):
        """
        :return: A list of trees that are burnt down.
        """
        burnt_trees = []
        for location in self.__fire_monitor:
            if self.__fire_monitor[location] == "charcoal":
                burnt_trees.append(location)
        return burnt_trees