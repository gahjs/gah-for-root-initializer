import { GahPluginConfig } from '@gah/shared';

export class ForRootInitializerConfig extends GahPluginConfig {
  public needsForRootInitialization: { baseModuleName: string, config: any }[];
}
