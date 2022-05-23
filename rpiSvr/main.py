import time
import busio
import adafruit_amg88xx  # Thermal camera Library
import math
import requests
import RPi.GPIO as GPIO
import json

import sys
sys.path.insert(0, './MFRC522-python/')
import MFRC522
import signal

def readTag():

    read = True
# Capture SIGINT for cleanup when the script is aborted

    def end(signal, frame):
        GPIO.cleanup()

    # Hook the SIGINT
    signal.signal(signal.SIGINT, end)

    # Inititate class MFRC522 from Mario Gomez
    Reader = MFRC522.MFRC522()

    # Welcome message
    print("present RFID Card")

    # loops until RFID card is detectd
    while read:

        # Scan for cards
        (status) = Reader.MFRC522_Request(Reader.PICC_REQIDL)

        # Detect card
        if status == Reader.MI_OK:
            print("Card detected")

        # Read card UID
        (status, uid) = Reader.MFRC522_Anticoll()

        # if card successfully reads extract UID to be added to payload
        if status == Reader.MI_OK:

            # uid is list of 4 values
            s = [str(i) for i in uid]
            # join each value in list to result variable
            result = str("".join(s))
            # covert UID to int
            print(int(result))
            print("")
            # convert uid to int
            userId = int(result)

            #CLEANUP gpio ready for AMG8833 sensor to be mounted
            GPIO.cleanup()

            return userId


def validate(uid, temp):
    try:
        url = 'https://covid-sys.herokuapp.com/validate'
        payload = {'uid': uid, 'temp': temp}

        # change verify to true once nodeJS has valid SSL certificate
        req = requests.post(url, verify=False,  json=payload)
        print(req.json)
        #store json  response
        json_repsonse = req.json()
        print(json_repsonse)
        print("")
        # auto converts Json to python dict
        return json_repsonse
    except Exception as e:
        print("Could not contact server, restarting Script!")
        main()


def door(valid): # using BCM GPIO numbers shown on wiring model
    GPIO.setmode(GPIO.BCM)
    led1 = 16 # BCM pin 16 / Physical Board pin 36
    led2 = 18 # BCM pin 18 / Physical Board pin 12
    #ENTRY
    if True in valid.values():
        GPIO.setup(led1, GPIO.OUT)
        GPIO.output(led1, True)
        print("user Valid")
        time.sleep(3)

        GPIO.output(led1, False)
        GPIO.cleanup()
    else:# No Entry
        GPIO.setup(led2, GPIO.OUT)
        GPIO.output(led2, True)
        print("user not valid")
        time.sleep(3)
        GPIO.output(led2, False)

        GPIO.cleanup()


def readTemp():
    import board as pboard
    # senor init termal and RFID
    i2c = busio.I2C(pboard.SCL, pboard.SDA)
    amg = adafruit_amg88xx.AMG88XX(i2c)
    # slep FIXED temp read issue
    time.sleep(1)
    total = 0
    for row in amg.pixels:
        # Add sum of temps from each row in camera pixels 8x8 = sum of 64 temp values
        total = total + math.fsum(row)
    # calculate average temp from 64 values
    userTemp = total / 64
    print(userTemp)
    print("")
    #CLEANUP gpio ready for MFRC522 reader to be mounted
    GPIO.cleanup()
    time.sleep(1)
    return float("{0:.1f}".format(userTemp))


def main():
    ready = True
    while ready:

        userId = readTag()

        time.sleep(1)

        userTemp = readTemp()

        time.sleep(1)

        valid = validate(userId, userTemp)

        door(valid)


if __name__ == "__main__":
    main()
