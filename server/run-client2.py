import os
import time
import csv
import json
import uuid
import threading
import smtplib
import posixpath
import time


from tornado.web import StaticFileHandler

from nitro.ioloop import IOLoop
from nitro.webserver import WebServer


HTTP_PORT = 8081

IS_DEVELOPMENT = True

ROOT_PATH = os.path.join(os.path.split(__file__)[0], "..")
CLIENT_PATH = os.path.join(ROOT_PATH, "client")
print CLIENT_PATH

io_loop = IOLoop()

def root_handler(request, response) :
    file_path = os.path.join(CLIENT_PATH, "index.html")
    data = file(file_path).read()
    response.set_content_type("text/html")
    response.send(data)


def send_email (request, response) :
    
    first_name = (request.parameter("first_name"))
    last_name =(request.parameter("last_name"))
    email_id = (request.parameter("email_id"))
    phone_no= (request.parameter("phone_no"))
    company_name= (request.parameter("company_name"))
    message_request=(request.parameter("message"))
    select_option=(request.parameter("select_option"))

    print first_name,last_name,email_id,phone_no,company_name,message_request,select_option

    sender = "amit.rebellion183@gmail.com"
    receivers = ["amit.maurya173@gmail.com"]
    yourname = first_name+" "+last_name
    recvname = "Favorable"
    sub = company_name#+" "+str(select_option)
    body = message_request
    message = "From: " + yourname + "\n" 
    #message = message + "To: " + recvname + "\n"
    #message = message + "Subject: "  + sub + "\n" 
    message = "Email:" + email_id+"\n"
    message=message+"Contact:"+str(phone_no)+"\n"
    message=message+"Message:"+message_request+"\n"
    server = smtplib.SMTP('smtp.gmail.com:587')
    username = 'amit.rebellion183@gmail.com'
    password = 'sourav183'
    server.ehlo()
    server.starttls()
    server.login(username,password)
    server.sendmail(sender, receivers, message)
    server.quit()

    response.send("col")


def save_email (request, response) :
    email_id = (request.parameter("email_id"))
    print email_id
    response.send("col")

def main():

    web_server = WebServer(io_loop)
    web_server.url("/", GET=root_handler)
    web_server.url("/send-email", GET=send_email, POST=send_email)
    web_server.url("/save-email", GET=save_email, POST=save_email)
    web_server.low_level_url(
        "/(.*)", StaticFileHandler, dict(path=CLIENT_PATH)
    )


    print "Listening on port: %s" % (HTTP_PORT,)
    web_server.start(HTTP_PORT)
    io_loop.run()


if __name__ == "__main__" :
    main()