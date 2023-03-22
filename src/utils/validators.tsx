export {};

interface ValidateAddressProps {
  name: string;
  line1: string;
  location: {
    coordinates: [string, string];
  };
}

module.exports.validateAddressInput = (props: ValidateAddressProps) => {
  const errors: any = {};

  if (props.name === '') {
    errors.name = 'Name must not be empty';
  } else if (props.line1 === '') {
    errors.line1 = 'Address line must not be empty';
  }
  // else if (props.location.coordinates === null) {
  //   errors.location = "Coordinates must exist";
  // }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

interface ValidateProps {
  name: string;
  price: string;
  barcode: string;
}

module.exports.validateProductInput = (props: ValidateProps) => {
  const errors: any = {};

  if (props.name === '') {
    errors.name = 'Name must not be empty';
  } else if (props.price === '') {
    errors.price = 'Price must not be empty';
  } else if (props.barcode === '') {
    errors.barcode = 'Barcode must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

interface StoreAddressValidateProps {
  line1: string;
  line2: string;
  pincode: string;
}

module.exports.validateStoreAddressInput = (
  props: StoreAddressValidateProps,
) => {
  const errors: any = {};

  if (props.line1 === '') {
    errors.line1 = 'Line 1 empty';
  } else if (props.line2 === '') {
    errors.line2 = 'Line 2 empty';
  } else if (props.pincode === '') {
    errors.pincode = 'Pincode is needed';
  } else if (props.pincode.length !== 6) {
    errors.pincode = 'Pincode digits not proper';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

interface ValidateContactProps {
  number: number;
}

module.exports.validateContact = (props: ValidateContactProps) => {
  const errors: any = {};

  if (props.number !== 10) {
    errors.number = 'Number must be valid';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
