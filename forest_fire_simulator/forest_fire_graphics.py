from graphics import *

def init_window_GUI():
    win_width = 800
    win_height = 500
    win_title = "Name this window"
    win = GraphWin(win_title, win_width, win_height)
    xspan = 150
    yspan = 100
    boader = 10
    win.setCoords(-boader, -boader, xspan + boader, yspan + boader)
    return win

def is_clicked(rectangle, click):
    """
    :param rectangle: A variable defined by Rectangle()
    :param click: A Point object
    :return: If the rectangle is clicked, return True, otherwise, return False
    """
    #Get the each value of the button
    corner_point1 = rectangle.getP1()
    corner_point2 = rectangle.getP2()
    x1 = corner_point1.x
    x2 = corner_point2.x
    y1 = corner_point1.y
    y2 = corner_point2.y
    #Get the range of the button
    x_range = abs(x1 - x2)
    y_range = abs(y1 - y2)
    center = rectangle.getCenter()
    center_x = center.x
    center_y = center.y
    #If the click is within half x_range/y_range from the center point, the click is on the button. If the click is on the button, return True.
    if (center_x - x_range/2) < click.x and (center_x + x_range/2) > click.x:
        if (center_y + y_range/2) > click.y and (center_y - y_range/2) < click.y:
            return True
    else:
        return False


def display_result_GUI(win, damage_percentage):
    """
    :param win:
    :param damage_percentage: Percentage of trees burnt down.
    :return: A message drawn after simulation.
    """
    message = Text(Point(130, 14), "{0:.2f}% of the trees burned down.".format(damage_percentage*100))
    message.setSize(16)
    message.draw(win)
    return message


def create_entry_box(win):
    entry = Entry(Point(130, 60), 15)
    entry.draw(win)
    text = Text(Point(130, 66), "Fire spreading rate(%)")
    text.setSize(14)
    text.draw(win)
    return entry


def createButton(window, p1 , p2, background_color, text, text_size, text_color):
    """Prameters: Take all the inputs needed to make a button.
       Type: background_color, text, and text_color should be strings. The others can be either int or float
       Return: A rectangle button drawn.
    """
    x1 = p1.x
    x2 = p2.x
    y1 = p1.y
    y2 = p2.y
    button = Rectangle(p1, p2)
    button.setFill(background_color)
    button.draw(window)
    #Put the text on the center of the rectangle
    center_p = Point((x1 + x2)/2, (y1 + y2)/2)
    text = Text(center_p, text)
    text.setTextColor(text_color)
    text.setSize(text_size)
    text.draw(window)
    return button

def create_messsage_box(window, p1 , p2, background_color):
    """Prameters: Take all the inputs needed to make a button.
       Type: background_color, text, and text_color should be strings. The others can be either int or float
       Void: A rectangle button drawn.
    """
    x1 = p1.x
    x2 = p2.x
    y1 = p1.y
    y2 = p2.y
    button = Rectangle(p1, p2)
    button.setFill(background_color)
    button.draw(window)

def initialize_instruction(win):
    """
    :param win:
    :return: 3 text objects to tell the user what to do before simulation.
    """
    message1 = Text(Point(130.5, 90), "☐ Enter a fire spreading rate".ljust(35))
    message2 = Text(Point(130, 85), "☐ Click on the trees to light fire ".ljust(35))
    message1.setTextColor("red")
    message2.setTextColor("red")
    message1.draw(win)
    message2.draw(win)
    message3 = Text(Point(130, 88), "Simulating forest fire")
    message3.setSize(18)
    return message1, message2, message3

def clicked(win, rectangle):
    """
    :param rectangle: A variable defined by Rectangle()
    :return: If the rectangle is clicked, return True, otherwise, return False
    """
    #Get the point of click
    click = win.getMouse()
    #Get the each value of the button
    corner_point1 = rectangle.getP1()
    corner_point2 = rectangle.getP2()
    x1 = corner_point1.x
    x2 = corner_point2.x
    y1 = corner_point1.y
    y2 = corner_point2.y
    #Get the range of the button
    x_range = abs(x1 - x2)
    y_range = abs(y1 - y2)
    center = rectangle.getCenter()
    center_x = center.x
    center_y = center.y
    #If the click is within half x_range/y_range from the center point, the click is on the button. If the click is on the button, return True.
    if (center_x - x_range/2) < click.x and (center_x + x_range/2) > click.x:
        if (center_y + y_range/2) > click.y and (center_y - y_range/2) < click.y:
            return True
    else:
        return False

def wait_until_click(window, button):
    """
    :param button: Should be Rectangle() object.
    :Void: Wait until the button is clicked.
    """
    print("Waiting until the button is clicked.")
    is_clicked = clicked(window, button)
    while not is_clicked:
        is_clicked = clicked(window, button)