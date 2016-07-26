SAFARI = Amp.safariextension
CHROME = Amp\ Chrome
CYAN = \033[0;36m
GREEN = \033[0;32m
BOLD = \033[1m
PLAIN = \033[0m

no_target: notarget all

all: chrome safari

notarget:
	@ echo "$(CYAN)$(BOLD)Note:$(PLAIN)$(CYAN) No target specified for make; building all targets.$(PLAIN)"

chrome: clean_chrome
	@ echo "> Copying files to Chrome extension folder..."
	@ cp -R icons $(CHROME)/icons
	@ cd src; cp amp.js ../$(CHROME)
	@ echo "$(GREEN)Chrome extention is ready!$(PLAIN)"

safari: clean_safari
	@ echo "> Copying files to Safari extension folder..."
	@ cp icons/* $(SAFARI)
	@ cd src; cp amp.js ../$(SAFARI)
	@ echo "$(GREEN)Safari extention is ready!$(PLAIN)"

clean: clean_chrome clean_safari
	@ rm -f  .DS_Store

clean_chrome:
	@ echo "> Cleaning Chrome extension folder..."
	@ rm -fr $(CHROME)/icons
	@ rm -f  $(CHROME)/amp.js $(CHROME)/.DS_Store

clean_safari:
	@ echo "> Cleaning Safari extension folder..."
	@ rm -f  $(SAFARI)/Icon*
	@ rm -f  $(SAFARI)/amp.js $(SAFARI)/.DS_Store