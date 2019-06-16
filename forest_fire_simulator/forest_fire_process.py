from random import random
def determiner(probability):
    """
    :param probability: Probability of returning True. A float ranging from 0.0 to 1.0
    :return: True or False depending on the probability. If it is 1.0, return True always, if  0.0, False always
    """
    num = random()
    if num < probability:
        return True
    else:
        return False


def get_next_fire_locations(locations_to_catch_fire, rate_of_fire_spread, location, num_of_rows, num_of_cols):
    """
    :param locations_to_catch_fire: A list of trees that are to catch fire
     :param rate_of_fire_spread: In float
    :param location: Where the tree is. The location in tuple
    :param num_of_rows:
    :param num_of_cols:
    :return: Determine if four of each adjacent tree catch fire. To catch fire, a tree has to be "not in the row/col at the verge
            and cannot already be in locations_to_catch_fire. Return a list of location tuples that correspond
            with the trees that would catch fire.
    """
    above = ()
    below = ()
    right = ()
    left = ()
    to_catch_fire = []
    if location[1] > 0:
        if determiner(rate_of_fire_spread) == True:
            above = (location[0], location[1] - 1)
            if above not in locations_to_catch_fire:
                to_catch_fire.append(above)

    if location[1] < num_of_rows - 1:
        if determiner(rate_of_fire_spread) == True:
            below = (location[0], location[1] + 1)
            if below not in locations_to_catch_fire:
                to_catch_fire.append(below)

    if location[0] < num_of_cols - 1:
        if determiner(rate_of_fire_spread) == True:
            right = (location[0] + 1, location[1])
            if right not in locations_to_catch_fire:
                to_catch_fire.append(right)

    if location[0] > 0:
        if determiner(rate_of_fire_spread) == True:
            left = (location[0] - 1, location[1])
            if left not in locations_to_catch_fire:
                to_catch_fire.append(left)

    return to_catch_fire
