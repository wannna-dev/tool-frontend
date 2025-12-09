uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uRadius;
uniform float uRefraction;
uniform float uChromatic;
uniform float uCurve;
uniform float uTime;
uniform float uFresnelPower;
uniform float uFresnelIntensity;
uniform vec3 uFresnelColor;

uniform float uMix;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);       // center of bubble
    vec2 dir = uv - center;
    float dist = length(dir);

    float normalizedDist = dist / uRadius;
    
    // --- Refraction (parabolic falloff)
    // distortion stronger at center (1 - r^2)
    // float distortion = 1.0 - normalizedDist * normalizedDist;
    float distortion = 1.0 - pow(normalizedDist, uCurve);
    // refracted offset in uv space (note: scaling by uRefraction)
    vec2 refractOffset = dir * distortion * uRefraction * uRadius;

    // Chromatic aberration: offset channels slightly differently
    float chromaFactor = normalizedDist * uChromatic;
    vec2 redOffset = refractOffset * (1.0 + chromaFactor);
    vec2 blueOffset = refractOffset * (1.0 - chromaFactor);
    vec2 greenOffset = refractOffset;


    vec4 redSample1   = texture2D(uTexture, uv - redOffset);
    vec4 greenSample1 = texture2D(uTexture, uv - greenOffset);
    vec4 blueSample1  = texture2D(uTexture, uv - blueOffset);

    vec4 redSample2   = texture2D(uTexture2, uv - redOffset);
    vec4 greenSample2 = texture2D(uTexture2, uv - greenOffset);
    vec4 blueSample2  = texture2D(uTexture2, uv - blueOffset);

    vec4 refractedColor;
    refractedColor.r = mix(redSample1, redSample2, uMix).r;
    refractedColor.g = mix(greenSample1, greenSample2, uMix).g;
    refractedColor.b = mix(blueSample1, blueSample2, uMix).b;
    refractedColor.a = 1.0;

    // --- Fresnel term
    // Simple approximation: more effect near edges
    float fresnel = pow(normalizedDist, uFresnelPower);
    refractedColor.rgb += fresnel * uFresnelIntensity * uFresnelColor;

    gl_FragColor = refractedColor;
}
