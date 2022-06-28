enum ResponseLocationType {
  CODE = 'search',
  TOKEN = 'hash'
}

namespace ResponseLocationType {
  export function getKey(type: ResponseLocationType): string {
    const indexOfValue = Object.values(ResponseLocationType).indexOf(type);
    return Object.keys(ResponseLocationType)[indexOfValue].toLowerCase();
  }
}

const ResponseDataType: Record<ResponseLocationType, string> = {
  [ResponseLocationType.CODE]: 'code',
  [ResponseLocationType.TOKEN]: 'access_token',
};

export { ResponseLocationType, ResponseDataType };
