*************************READ ME FILE*************************
************************DEVSPRINT-2-CSE***********************
*****************TEAM CONSOLE.LOG("WINNERS")******************

**#Project content:**

    - This solution is desined to handle registration and
    participants selection process for the CSE events,
    varying from internal to external, all events with all
    sorts of natures can be handled with ease thanks to This
    app, which offers:

        - AUTOMATED EMAIL SYSTEM:
            - automatically generating unique QR codes for 
            accepted members
            - sending real-time emails once the participant's
            application is approved or declined by the admin
        
        - EVENTS DATABASE:
            - database seeding from CSV FILE (creating the 
            different events from a sheet)
            - updating database content by the admin (for 
            the different models)
            - browsing event details by members (displaying
             all the event details)
        
        - NOTIFCATION SYSTEM:
            - the admin recieves a notification every time
             a participation request is made (in-app 
             notifications)
            - admin may access a whole dashboard of
            notifications (view all the notifications that 
            he receieved)
            - the ability of accepting/refusing request from
            notification
            - marking the notifications a read once dealt 
            with, alongside the ability of marking it as 
            unread

**#Our touch:**

    - We included an authentification system allowing us
    to work on a real case integral fully featured backend 
    project. alongside authenticate/ restrictTo functions

    - Adding the eventRequest model:
        since there is a relationship of many-to-many 
        between the "participant" and the "events",we 
        have to create a junction collection where its
        primary kez is the pair (PK1-PK2)


    - Logical deletion (aka. Soft deletion): we figured 
    it is essential for the club's management system to
    keep track of the previous events, the ones conducted,
    and the others canceled in order to preserve an archive
    contributing in realizing useful sttistics and influencing
    further decisions in the club. As well as deleting an 
    event will cause a major data loss (if we use delete onCascade)

    - We opted for fetching only the upcoming events for
    the members as it would be chaotic and redundant to
    display to them, the canceled and completed events.

    - We wanted the evaluation experience to be as fluid as
    possible, so we set up a POSTMAN workspace highlighting
    all the http requests setten up for you to test.
        
    ![My image](diagram-01.jpg)