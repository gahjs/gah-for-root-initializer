import { GahPlugin, GahPluginConfig } from '@awdware/gah-shared';

import { ForRootInitializerConfig } from './for-root-initializer-config';

/**
 * A gah plugin has to extend the abstract GahPlugin base class and implement the abstract methods.
 */
export class ForRootInitializer extends GahPlugin {
  constructor() {
    // Call the constructor with the name of the plugin (only used for logging, does not need to match the package name)
    super('ForRootInitializer');
  }

  /**
   * Called after adding the plugin with gah. Used to configure the plugin.
   * @param existingCfg This will be passed by gah and is used to check wheter a property is already configured or not
   */
  public async onInstall(existingCfg?: ForRootInitializerConfig): Promise<GahPluginConfig> {
    if (!existingCfg?.needsForRootInitialization) {
      this.loggerService.warn('Plugin not configured. Please edit the configuration manually in the gah-config.json');
    }
    return existingCfg ?? new ForRootInitializerConfig();
  }

  /**
   * Called everytime gah gets used for all configured plugins. Register your handlers here.
   */
  public onInit() {
    this.registerEventListener('TEMPLATE_DATA_GENERATED', (event) => {
      if (!event.module?.isHost) {
        return;
      }

      const cfg = this.config as ForRootInitializerConfig;
      for (var init of cfg.needsForRootInitialization) {
        this.loggerService.debug(`ModuleName: ${init.baseModuleName} InitConfig: ${init.config}`);
      }

      for (const tempData of event.module?.gahFolder.modulesTemplateData.modules) {
        const addForRoot = this.cfg.needsForRootInitialization.find(x => x.baseModuleName === tempData.baseModuleName);
        const configuration = addForRoot?.config ? addForRoot.config : {};
        if (addForRoot) {
          tempData.staticModuleInit = `.forRoot(${JSON.stringify(configuration)})`;
        }
      }
    });
  }

  /**
   * For convenience the correctly casted configuration
   */
  private get cfg() {
    return this.config as ForRootInitializerConfig;
  }
}
