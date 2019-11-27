from setuptools import setup

setup(
    name='dank_bank',
    version='1.0.0',
    install_requires=[
        "falcon",
        "falcon-cors",
        "falcon-multipart",
        "PyJWT",
        "pytest",
        "msgpack"
    ]
)
