from jinja2 import Template
from .paths import STATIC_DIR


def get_template(name):
    path = (STATIC_DIR / name).absolute()
    if not path.is_file():
        raise FileNotFoundError(
            f"Could not find the template {path} on the server!")
    with open(path, 'r') as f:
        return Template(f.read())


class IndexServer:
    def on_get(self, req, resp):
        resp.content_type = "text.html"
        resp.body = get_template("../frontend/index.html").render()


class StaticServer:
    def on_get(self, req, resp):
        pass
