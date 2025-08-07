import QRCode from 'qrcode'

export const useQrGenerator = async (text: string) => {
  return await QRCode.toDataURL(text)
}
