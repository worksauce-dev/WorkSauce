export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^01[0|1|6|7|8|9][0-9]{7,8}$/;
  return phoneRegex.test(phone);
};
