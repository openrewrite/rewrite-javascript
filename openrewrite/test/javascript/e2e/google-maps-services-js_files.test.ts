import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('google-maps-services-js files tests', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('client.test.ts', () => {
      rewriteRun(
          //language=typescript
          typeScript(`
             /**
               * Copyright 2020 Google LLC
               *
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               *
               *      http://www.apache.org/licenses/LICENSE-2.0
               *
               * Unless required by applicable law or agreed to in writing, software
               * distributed under the License is distributed on an "AS IS" BASIS,
               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
               * See the License for the specific language governing permissions and
               * limitations under the License.
               */

              import {
                Client,
                defaultAxiosInstance,
                defaultHttpsAgent,
                type ElevationResponse,
              } from "../src";
              import { AxiosError } from "axios";

              test("client should work with defaults", async () => {
                const location = { lat: 10, lng: 20 };

                const params = {
                  locations: [location, location],
                  key: process.env.GOOGLE_MAPS_API_KEY,
                };
                const client = new Client();
                const r = await client.elevation({ params: params });

                expect(r.data.results.length).toEqual(2);
              });

              test("client should work with modified config", async () => {
                const location = { lat: 10, lng: 20 };

                const params = {
                  locations: [location, location],
                  key: process.env.GOOGLE_MAPS_API_KEY,
                };
                const client = new Client({
                  config: { timeout: 30000, httpsAgent: defaultHttpsAgent },
                });
                const r = await client.elevation({ params: params });

                expect(r.data.results.length).toEqual(2);
              });

              test("client should work with instance", async () => {
                const location = { lat: 10, lng: 20 };

                const params = {
                  locations: [location, location],
                  key: process.env.GOOGLE_MAPS_API_KEY,
                };
                const client = new Client({ axiosInstance: defaultAxiosInstance });
                const r = await client.elevation({ params: params });

                expect(r.data.results.length).toEqual(2);
              });

              test("readme example using client", async () => {
                const { Client, Status } = require("../src");
                const client = new Client({});

                await client
                  .elevation({
                    params: {
                      locations: [{ lat: 45, lng: -110 }],
                      key: process.env.GOOGLE_MAPS_API_KEY,
                    },
                    timeout: 1000, // milliseconds
                  })
                  .then((r) => {
                    expect(r.data.status).toEqual(Status.OK);
                    expect(r.data.results[0].elevation).toBeGreaterThan(2000);
                    expect(r.data.results[0].elevation).toBeLessThan(3000);
                  })
                  .catch((e) => {
                    console.log(e);
                    throw "Should not error";
                  });
              });

              test("readme example using client fails correctly", async () => {
                const { Client, Status } = require("../src");
                const client = new Client({});

                await client
                  .elevation({
                    params: {
                      locations: [{ lat: 45, lng: -110 }],
                      key: "invalid key",
                    },
                    timeout: 1000, // milliseconds
                  })
                  .catch((e: AxiosError) => {
                    const response = e.response as ElevationResponse;
                    expect(response.status).toEqual(403);
                    expect(response.data.status).toEqual(Status.REQUEST_DENIED);
                  });
              });
          `)
        );
    });

    test('reversegeocode.ts', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
             /**
               * Copyright 2020 Google LLC
               *
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               *
               *      http://www.apache.org/licenses/LICENSE-2.0
               *
               * Unless required by applicable law or agreed to in writing, software
               * distributed under the License is distributed on an "AS IS" BASIS,
               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
               * See the License for the specific language governing permissions and
               * limitations under the License.
               */

              import { AddressType, Language, LatLng, RequestParams } from "../common";
              import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
              import { GeocodeResult, ResponseData, AddressDescriptor } from "../common";
              import { latLngToString, enableAddressDescriptorToString, serializer } from "../serialize";

              import { defaultAxiosInstance } from "../client";

              /**
               * If both \`result_type\` and \`location_type\` filters are present then the API returns only those results that match both the
               * \`result_type\` and the \`location_type\` values. If none of the filter values are acceptable, the API returns \`ZERO_RESULTS\`.
               */
              export enum ReverseGeocodingLocationType {
                /** returns only the addresses for which Google has location information accurate down to street address precision. */
                ROOFTOP = "ROOFTOP",
                /**
                 * returns only the addresses that reflect an approximation (usually on a road) interpolated between two precise points
                 * (such as intersections). An interpolated range generally indicates that rooftop geocodes are unavailable for a street address.
                 */
                RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
                /** returns only geometric centers of a location such as a polyline (for example, a street) or polygon (region). */
                GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
                /** returns only the addresses that are characterized as approximate. */
                APPROXIMATE = "APPROXIMATE",
              }

              export interface ReverseGeocodeRequest extends Partial<AxiosRequestConfig> {
                params: {
                  /** The latitude and longitude values specifying the location for which you wish to obtain the closest, human-readable address. */
                  latlng?: LatLng;
                  /**
                   * The place ID of the place for which you wish to obtain the human-readable address.
                   * The place ID is a unique identifier that can be used with other Google APIs.
                   * For example, you can use the \`placeID\` returned by the Roads API to get the address for a snapped point.
                   * The place ID may only be specified if the request includes an API key or a Google Maps APIs Premium Plan client ID.
                   */
                  place_id?: string;
                  /**
                   * The language in which to return results.
                   *  - Google often updates the supported languages, so this list may not be exhaustive.
                   *  - If \`language\` is not supplied, the geocoder attempts to use the preferred language as specified in the
                   *    \`Accept-Language\` header, or the native language of the domain from which the request is sent.
                   *  - The geocoder does its best to provide a street address that is readable for both the user and locals.
                   *    To achieve that goal, it returns street addresses in the local language, transliterated to a script readable by the user
                   *    if necessary, observing the preferred language. All other addresses are returned in the preferred language.
                   *    Address components are all returned in the same language, which is chosen from the first component.
                   *  - If a name is not available in the preferred language, the geocoder uses the closest match.
                   */
                  language?: Language;
                  /**
                   * A filter of one or more address types, separated by a pipe (\`|\`).
                   * If the parameter contains multiple address types, the API returns all addresses that match any of the types.
                   * A note about processing: The \`result_type\` parameter does not restrict the search to the specified address type(s).
                   * Rather, the \`result_type\` acts as a post-search filter: the API fetches all results for the specified \`latlng\`,
                   * then discards those results that do not match the specified address type(s).
                   * Note: This parameter is available only for requests that include an API key or a client ID.
                   */
                  result_type?: AddressType[];
                  /**
                   * A filter of one or more location types, separated by a pipe (\`|\`).
                   * If the parameter contains multiple location types, the API returns all addresses that match any of the types.
                   * A note about processing: The \`location_type\` parameter does not restrict the search to the specified location type(s).
                   * Rather, the \`location_type\` acts as a post-search filter: the API fetches all results for the specified \`latlng\`,
                   * then discards those results that do not match the specified location type(s).
                   * Note: This parameter is available only for requests that include an API key or a client ID.
                   */
                  location_type?: ReverseGeocodingLocationType[];
                  /**
                   * Determines whether the address descriptor is returned in the response.
                   */
                  enable_address_descriptor?: boolean;
                } & RequestParams;
              }

              export interface ReverseGeocodeResponseData extends ResponseData {
                /**
                 * contains an array of geocoded address information and geometry information.
                 *
                 * Generally, only one entry in the \`"results"\` array is returned for address lookups,though the geocoder may return several results
                 * when address queries are ambiguous.
                 */
                results: GeocodeResult[];
                /**
                 * The Address Descriptor for the target.
                 */
                address_descriptor: AddressDescriptor;
              }

              export interface ReverseGeocodeResponse extends AxiosResponse {
                data: ReverseGeocodeResponseData;
              }

              export const defaultUrl = "https://maps.googleapis.com/maps/api/geocode/json";

              export const defaultParamsSerializer = serializer(
                {
                  latlng: latLngToString,
                  enable_address_descriptor: enableAddressDescriptorToString
                },
                defaultUrl
              );

              export function reverseGeocode(
                {
                  params,
                  method = "get",
                  url = defaultUrl,
                  paramsSerializer = defaultParamsSerializer,
                  ...config
                }: ReverseGeocodeRequest,
                axiosInstance: AxiosInstance = defaultAxiosInstance
              ): Promise<ReverseGeocodeResponse> {
                return axiosInstance({
                  params,
                  method,
                  url,
                  paramsSerializer,
                  ...config,
                }) as Promise<ReverseGeocodeResponse>;
              }

          `)
        );
    });
    test('adapter.ts', () => {
      rewriteRun(
          //language=typescript
          typeScript(`
              /**
               * Copyright 2020 Google LLC
               *
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               *
               *      http://www.apache.org/licenses/LICENSE-2.0
               *
               * Unless required by applicable law or agreed to in writing, software
               * distributed under the License is distributed on an "AS IS" BASIS,
               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
               * See the License for the specific language governing permissions and
               * limitations under the License.
               */

              import { Status } from "./common";

              import axios from "axios";
              import type { AxiosResponse } from "axios";

              export function statusToCode(status: Status): number {
                  switch (status) {
                      case Status.OK:
                      case Status.ZERO_RESULTS: {
                          return 200;
                      }
                      case Status.INVALID_REQUEST:
                      case Status.MAX_ROUTE_LENGTH_EXCEEDED:
                      case Status.MAX_WAYPOINTS_EXCEEDED: {
                          return 400;
                      }
                      case Status.REQUEST_DENIED: {
                          return 403;
                      }
                      case Status.NOT_FOUND: {
                          return 404;
                      }
                      case Status.OVER_DAILY_LIMIT:
                      case Status.OVER_QUERY_LIMIT: {
                          return 429;
                      }
                      case Status.UNKNOWN_ERROR: {
                          return 500;
                      }
                      default: {
                          return 200;
                      }
                  }
              }

              function settle(resolve, reject, response) {
                  const validateStatus = response.config.validateStatus;
                  if (!response.status || !validateStatus || validateStatus(response.status)) {
                      resolve(response);
                  } else {
                      reject(
                          new axios.AxiosError(
                              "Request failed with status code " + response.status,
                              [axios.AxiosError.ERR_BAD_REQUEST, axios.AxiosError.ERR_BAD_RESPONSE][
                              Math.floor(response.status / 100) - 4
                                  ],
                              response.config,
                              response.request,
                              response
                          )
                      );
                  }
              }

              export const customAdapter = axios.getAdapter((config) => {
                  const httpAdapter = axios.getAdapter("http");

                  return new Promise((resolve, reject) => {
                      httpAdapter(config)
                          .then((r: AxiosResponse) => {
                              // unfortunately data is transformed after the adapter
                              let data = r.data;
                              if (config.transformResponse) {
                                  const t = Array.isArray(config.transformResponse)
                                      ? config.transformResponse
                                      : [config.transformResponse];
                                  for (const fn of t) {
                                      data = fn.call(config, data, r.headers, r.status);
                                  }
                              }

                              if (r.status === 200 && data.status) {
                                  r.status = statusToCode(data.status);
                              }

                              settle(resolve, reject, r);
                          })
                          .catch(reject);
                  });
              });
          `)
        );
    })

    test('serialize.test.ts', () => {
      rewriteRun(
          //language=typescript
          typeScript(`
              /**
               * Copyright 2020 Google LLC
               *
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               *
               *      http://www.apache.org/licenses/LICENSE-2.0
               *
               * Unless required by applicable law or agreed to in writing, software
               * distributed under the License is distributed on an "AS IS" BASIS,
               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
               * See the License for the specific language governing permissions and
               * limitations under the License.
               */

              import { LatLng, LatLngLiteral } from "./common";
              import {
                  createPremiumPlanQueryString,
                  latLngArrayToStringMaybeEncoded,
                  latLngBoundsToString,
                  latLngToString,
                  objectToString,
                  serializer,
                  toLatLngLiteral,
                  toTimestamp,
              } from "./serialize";

              test("latLngToString is correct", () => {
                  expect(latLngToString("")).toBe("");
                  expect(latLngToString("10,20")).toBe("10,20");
                  expect(latLngToString([10, 20])).toBe("10,20");
                  expect(latLngToString({ lat: 10, lng: 20 })).toBe("10,20");
                  expect(latLngToString({ latitude: 10, longitude: 20 })).toBe("10,20");
                  expect(() => {
                      latLngToString({} as LatLngLiteral);
                  }).toThrow(TypeError);
              });

              test("latLngBoundsToString is correct", () => {
                  expect(latLngBoundsToString("")).toBe("");
                  expect(
                      latLngBoundsToString({
                          southwest: { lat: 1, lng: 2 },
                          northeast: { lat: 3, lng: 4 },
                      })
                  ).toBe("1,2|3,4");
              });

              test("serializer", () => {
                  expect(
                      serializer({ quz: (o) => o }, "http://mock.url")({ foo: ["bar"] })
                  ).toBe("foo=bar");
                  expect(
                      serializer(
                          {
                              foo: (o) => o.map((latLng: LatLng) => latLngToString(latLng)),
                          },
                          "http://mock.url"
                      )({
                          foo: [
                              [0, 1],
                              [2, 3],
                          ],
                      })
                  ).toBe("foo=0%2C1|2%2C3");
              });

              test("serializer should not mutate params", () => {
                  const location = { lat: 0, lng: 1 };
                  const params = {
                      location,
                  };

                  serializer({ location: latLngToString }, "http://mock.url")(params);
                  expect(params.location).toBe(location);
              });

              test("serializer should return pipe joined arrays by default", () => {
                  expect(serializer({}, "http://mock.url")({ foo: ["b", "a", "r"] })).toBe(
                      "foo=b|a|r"
                  );
              });

              test("serializer creates premium plan query string if premium plan params are included", () => {
                  const params = {
                      avoid: "ferries",
                      destination: {
                          lat: "38.8977",
                          lng: "-77.0365",
                      },
                      mode: "driving",
                      origin: {
                          lat: "33.8121",
                          lng: "-117.9190",
                      },
                      units: "imperial",
                      client_id: "testClient",
                      client_secret: "testClientSecret",
                  };

                  expect(
                      serializer(
                          {
                              origin: latLngToString,
                              destination: latLngToString,
                          },
                          "https://test.url/maps/api/directions/json"
                      )(params)
                  ).toEqual(
                      "avoid=ferries&client=testClient&destination=38.8977%2C-77.0365&mode=driving&origin=33.8121%2C-117.9190&units=imperial&signature=YRJoTd6ohbpsR14WkWv3S7H6MqU="
                  );
              });

              test("objectToString", () => {
                  expect(objectToString("foo")).toBe("foo");
                  expect(objectToString({ c: "c", a: "a", b: "b" })).toBe("a:a|b:b|c:c");
              });

              test("latLngArrayToStringMaybeEncoded", () => {
                  expect(latLngArrayToStringMaybeEncoded("0,0")).toEqual("0,0");
                  expect(latLngArrayToStringMaybeEncoded([[0, 0]])).toEqual("0,0");
                  expect(
                      latLngArrayToStringMaybeEncoded([
                          [40.714728, -73.998672],
                          [-34.397, 150.644],
                      ])
                  ).toEqual("enc:abowFtzsbMhgmiMuobzi@");
              });

              test("toLatLngLiteral", () => {
                  expect(toLatLngLiteral("0,1")).toEqual({ lat: 0, lng: 1 });
                  expect(toLatLngLiteral([0, 1])).toEqual({ lat: 0, lng: 1 });
                  expect(toLatLngLiteral({ lat: 0, lng: 1 })).toEqual({
                      lat: 0,
                      lng: 1,
                  });
                  expect(toLatLngLiteral({ latitude: 0, longitude: 1 })).toEqual({
                      lat: 0,
                      lng: 1,
                  });
                  expect(() => {
                      toLatLngLiteral({} as LatLngLiteral);
                  }).toThrow(TypeError);
              });

              test("toTimestamp", () => {
                  expect(toTimestamp(100)).toEqual(100);

                  const dt = new Date();
                  const seconds = Math.round(Number(dt) / 1000);
                  expect(toTimestamp(dt)).toEqual(seconds);
                  expect(toTimestamp("now")).toEqual("now");

                  expect(toTimestamp(new Date("2022-06-22T09:03:33.430Z"))).toEqual(1655888613);
              });

              test("createPremiumPlanQueryString", () => {
                  const serializedParams = {
                      avoid: "ferries",
                      destination: "38.8977,-77.0365",
                      mode: "driving",
                      origin: "33.8121,-117.9190",
                      units: "imperial",
                      client_id: "testClient",
                      client_secret: "testClientSecret",
                  };
                  const queryStringOptions = {
                      arrayFormat: "separator",
                      arrayFormatSeparator: "|",
                  };
                  const baseUrl = "https://test.url/maps/api/directions/json";

                  expect(
                      createPremiumPlanQueryString(serializedParams, queryStringOptions, baseUrl)
                  ).toEqual(
                      "avoid=ferries&client=testClient&destination=38.8977%2C-77.0365&mode=driving&origin=33.8121%2C-117.9190&units=imperial&signature=YRJoTd6ohbpsR14WkWv3S7H6MqU="
                  );
              });
          `)
        );
    });

    test('serialize.ts', () => {
      rewriteRun(
          //language=typescript
          typeScript(`
              /**
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *      http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */

                import { LatLng, LatLngBounds, LatLngLiteral } from "./common";

                import { encodePath } from "./util";
                import { createSignature } from "@googlemaps/url-signature";
                import queryString from "query-string";

                const qs = queryString.stringify;

                const separator = "|";

                export function latLngToString(o: LatLng) {
                  if (typeof o === "string") {
                    return o;
                  } else if (Array.isArray(o) && o.length === 2) {
                    // no transformation
                  } else if ("lat" in o && "lng" in o) {
                    o = [o.lat, o.lng];
                  } else if ("latitude" in o && "longitude" in o) {
                    o = [o.latitude, o.longitude];
                  } else {
                    throw new TypeError();
                  }

                  return o
                    .map((x) => {
                      return x.toString();
                    })
                    .join(",");
                }

                export function enableAddressDescriptorToString(o: boolean) {
                  if (typeof o === "string") {
                    return o;
                  } else if (o == true) {
                    return "True";
                  } else {
                    return "False";
                  }
                }

                export function objectToString(o: string | object): string {
                  if (typeof o === "string") {
                    return o;
                  } else {
                    const keys = Object.keys(o);
                    keys.sort();
                    return keys.map((k) => k + ":" + o[k]).join(separator);
                  }
                }

                export function latLngBoundsToString(latLngBounds: string | LatLngBounds) {
                  if (typeof latLngBounds === "string") {
                    return latLngBounds;
                  } else {
                    return (
                      latLngToString(latLngBounds.southwest) +
                      separator +
                      latLngToString(latLngBounds.northeast)
                    );
                  }
                }

                export function toLatLngLiteral(o: LatLng): LatLngLiteral {
                  if (typeof o === "string") {
                    const parts = o.split(",").map(Number);
                    return { lat: parts[0], lng: parts[1] };
                  } else if (Array.isArray(o) && o.length === 2) {
                    const parts = o.map(Number);
                    return { lat: parts[0], lng: parts[1] };
                  } else if ("lat" in o && "lng" in o) {
                    return o;
                  } else if ("latitude" in o && "longitude" in o) {
                    return { lat: o.latitude, lng: o.longitude };
                  } else {
                    throw new TypeError();
                  }
                }

                export function latLngArrayToStringMaybeEncoded(o: string | LatLng[]): string {
                  if (typeof o === "string") {
                    return o;
                  }

                  const concatenated = o.map(latLngToString).join(separator);
                  const encoded = \`enc:\${encodePath(o.map(toLatLngLiteral))}\`;

                  if (encoded.length < concatenated.length) {
                    return encoded;
                  }

                  return concatenated;
                }

                export type serializerFunction = (any) => string | number | boolean;
                export type serializerFormat = { [key: string]: serializerFunction };

                export function serializer(
                  format: serializerFormat,
                  baseUrl: string,
                  queryStringOptions: object = {
                    arrayFormat: "separator",
                    arrayFormatSeparator: separator,
                  }
                ) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return (params: Record<string, any>) => {
                    // avoid mutating params
                    const serializedParams = { ...params };

                    for (const key of Object.keys(format)) {
                      if (key in serializedParams) {
                        serializedParams[key] = format[key](serializedParams[key]);
                      }
                    }

                    if (
                      "client_id" in serializedParams &&
                      "client_secret" in serializedParams
                    ) {
                      // Special case to handle premium plan signature
                      return createPremiumPlanQueryString(
                        serializedParams,
                        queryStringOptions,
                        baseUrl
                      );
                    }

                    return qs(serializedParams, queryStringOptions);
                  };
                }

                export function toTimestamp(o: "now" | number | Date): number | "now" {
                  if (o === "now") {
                    return o;
                  }
                  if (o instanceof Date) {
                    return Math.round(Number(o) / 1000);
                  }
                  return o;
                }

                export function createPremiumPlanQueryString(
                  serializedParams: { [key: string]: string },
                  queryStringOptions: object,
                  baseUrl: string
                ): string {
                  serializedParams.client = serializedParams.client_id;
                  const clientSecret = serializedParams.client_secret;
                  delete serializedParams.client_id;
                  delete serializedParams.client_secret;

                  const partialQueryString = qs(serializedParams, queryStringOptions);
                  const unsignedUrl = \`\${baseUrl}?\${partialQueryString}\`;
                  const signature = createSignature(unsignedUrl, clientSecret);

                  // The signature must come last
                  return \`\${partialQueryString}&signature=\${signature}\`;
                }

          `)
        );
    });

});
