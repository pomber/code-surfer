def ms(my_list):
    size = len(my_list)
    if size > 2:
        half = size / 2
        left, right = ms(my_list[:half]), ms(my_list[half:])
        ret = []
        for i in range(size):
            if len(left) <= 0 or (len(right) > 0 and left[0] > right[0]):
                ret.append(right.pop(0))
            else:
                ret.append(left.pop(0))
        return ret
    elif size > 1 and my_list[0] > my_list[1]:
        return [my_list[1], my_list[0]]
    else:
        return my_list


print ms([7, 1, 4, 5])
