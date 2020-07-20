import { GahPluginConfig } from '@awdware/gah-shared';

export class ForRootInitializerConfig extends GahPluginConfig {
  public needsForRootInitialization: { baseModuleName: string, config: any }[];
}
