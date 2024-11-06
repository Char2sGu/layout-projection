export interface BorderRadiusConfig {
  topLeft: BorderRadiusCornerConfig;
  topRight: BorderRadiusCornerConfig;
  bottomLeft: BorderRadiusCornerConfig;
  bottomRight: BorderRadiusCornerConfig;
}

export interface BorderRadiusCornerConfig {
  x: number;
  y: number;
}
