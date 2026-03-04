Vision:
fully managed twitter account that posts generated 'concept' pokemons X times a day; developed using AI for the entireity of it.

Tech stack: tbd

Core functionality (posting):
1) pull two pokemon from a database of pokemons (this will have their name, stats, characteristics etc)
    - (with some logic to filter out 'impossible combinations' - mostly based on pokemon types-)
2) Generate a fusion name (using the data from previous step)
3) with this name, and the original names, generate 3 versions of what the fusion would look like 
    - The prompt for the fusion generation is key
4) Generate what the fused stats/charactestics will be
5) [Optional]: Generate an image of the pokemon
    - Prompt here is crucial
6) Post a twitter message with the name, image , stats, characteristics

Future state functionality (engagement) 
- Look at existing pokemon threads
    - Predefined list of twitter handlers to crawl?
- Like and comment on some of them to generate traction on our twitter
    - Some configuration around how to do this will be necessary

MVP
1) Dashboard to manage the different steps (web based?)
    - Generates [N] configurable potential options
    - No image, that will come later.
2) Generates a preview of what the tweet would look like for each option; allows to redo them all, or any of them

Future state:
1) Twitter integration to post the message

Code management:
- Github repository for this folder (ignore the data and temp folders)
- Github project to create the stories and track progress
