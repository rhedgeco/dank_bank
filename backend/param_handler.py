def validate_params(param_list, *args):
    arg_list = list(args)
    for arg in arg_list:
        if arg not in param_list:
            return False

    return True

def validate_one(param_list, *args):
    arg_list = list(args)
    for arg in arg_list:
        if arg in param_list:
            return True

    return False
