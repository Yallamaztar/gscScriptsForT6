// IW4M Plugin

let restrictedCountryCodes = []

const init = (registerNotify, serviceResolver, configWrapper, pluginHelper) => {
    registerNotify('IManagementEvenSubscriptions.ClientStateAuthorized', (authorizedEvent, token) => pluginHelper.onClientAuthorized(authorizedEvent, token));

    plugin.onLoad(serviceResolver, configWrapper, pluginHelper);
    return plugin;
};

const plugin = {
    author: 'Budiwrld',
    version: '1.0',
    name: 'Country Ban Plugin',
    manager: null,
    configWrapper: null,
    logger: null,
    serviceResolver: null,
    translations: null,
    pluginHelper: null,
    enabled: true,

    commands: {
        name: bancountry,
        description: 'ban a country by its country code',
        alias: 'bc',
        permission: 'SeniorAdmin',
        targetRequired: true,
        arguments: [{
            name: 'country',
            required: true
        }],

        execute: (gameEvent) => {
            restrictedCountryCodes.push(country);
            plugin.configWrapper.setValue('restrictedCountries', restrictedCountryCodes);

            gameEvent.origin.tell(`Successfully banned ${country}`);
        }
    },

    onClientAuthorized: async function (authorizeEvent, token) {
        if (authorizeEvent.client.isBot || !this.enabled) {
            return;
        }
        await this.checkCountry(authorizeEvent.client, token);
    },

    onLoad: function (serviceResolver, configWrapper, pluginHelper) {
        this.serviceResolver = serviceResolver;
        this.configWrapper = configWrapper;
        this.pluginHelper = pluginHelper;
        this.manager = this.serviceResolver.resolveService('IManager');
        this.logger = this.serviceResolver.resolveService('ILogger', ['ScriptPluginV2']);
        this.translations = this.serviceResolver.resolveService('ITranslationLookup');

        this.configWrapper.setName(this.name);
        this.configWrapper.getValue('restrictedCountryCodes').forEach(element => restrictedCountryCodes.push(parseInt(element)));
        this.logger.logInformation(`Loaded ${restrictedCountryCodes.length} countries into the list`);

        this.enabled = this.configWrapper.getValue('enabled', newValue => {
            if (newValue) {
                plugin.logger.logInformation('{Name} configuration updated. Enabled={Enabled}', newValue);
                plugin.enabled = newValue;
            }
        });

        if (this.enabled === undefined) {
            this.configWrapper.setValue('enabled', true);
            this.enabled = true;
        }
    },

    checkCountry: async function (origin, _) {
        const userAgent = `IW4MAdmin-${this.manager.getApplicationSettings().configuration().id}`;
        const stringDict = System.Collections.Generic.Dictionary(System.String, System.String);
        const headers = new stringDict();
        headers.add('User-Agent', userAgent);
        const pluginScript = importNamespace('IW4MAdmin.Application.Plugin.Script');
        const request = new pluginScript.ScriptPluginWebRequest(`http://ip-api.com/json/${origin.IPAddressString}`, 
            null, 'GET', 'application/json', headers);
        
        try {
            this.pluginHelper.requestUrl(request, (response) => this.onApiResponse(response, origin));
        } catch (ex) {
            this.logger.logWarning('There was a problem getting clients country - {message}',
                response);
            return;
        }
    },

    onApiResponse: function (response, origin) {
        let parsedJSON = null;

        try {
            parsedJSON = JSON.parse(response);
        } catch {
            this.logger.logWarning('There was a problem getting clients country - {message}',
                response);
            return;
        }
        const countryCode = parsedJSON.countryCode;
        if (restrictedCountryCodes.includes(countryCode)) {
            // create a custom translation in /sharedLibraryCore/PartialEntities/EFClient.cs
            origin.kick(this.translations['YOUR_TRANSLATION'] + '' + additionalInfo, origin.currentServer.asConsoleClient());
        } else {
            this.logger.logDebug('{Client} is not from a banned country', origin);
        }
    }
};
