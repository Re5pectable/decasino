class Item:
    def __init__(self, background_color=None, left=None, name=None):
        self.background_color = background_color
        self.left = left
        self.html = f'<div class="item" style="background-color: {self.background_color}; left: {self.left}"></div>'
        self.importance = 'low'
        self.name = name