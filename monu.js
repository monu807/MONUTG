// ╔══════════════════════════════════════════════╗
// ║         M O N U  V 𝟪  +  T E L E G R A M       ║
// ╚══════════════════════════════════════════════╝

import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    delay,
    fetchLatestBaileysVersion,
    Browsers,
    downloadMediaMessage
} from '@whiskeysockets/baileys';
import { Telegraf, Markup } from 'telegraf';
import { Boom }          from '@hapi/boom';
import pino              from 'pino';
import fs                from 'fs';
import readline          from 'readline';
import { EdgeTTS }       from '@andresaya/edge-tts';
import { spawnSync }     from 'child_process';
import ffmpegPath        from 'ffmpeg-static';
import { createCanvas, loadImage } from 'canvas';
import { parse as twParse }        from 'twemoji-parser';

// ============================================================
// 📌 TELEGRAM CONFIGURATION
// ============================================================
const BOT_TOKEN = "8842398451:AAH3bV1kpsuKgDEDWykbmia-Vep_12Z2nPU";
const OWNER_TG = "@itzstylishm0nu";
const CHANNEL_TG = "@MONUB4BU";
const GROUP_TG = "@MONUBAAP";
const RAW_OWNER_NUMBER = '919310435954';

const REQUIRED_CHANNELS = [
    { id: CHANNEL_TG, name: "MONU B4BU", link: "https://t.me/MONUB4BU", emoji: "🔥" },
    { id: GROUP_TG, name: "MONUBAAP", link: "https://t.me/MONUBAAP", emoji: "💀" }
];

// ─────────────────────────────────────────────
//  STORAGE PATHS
// ─────────────────────────────────────────────
const PATH_AUTH    = (id) => `./sessions/${id}`;
const PATH_USERS   = './store/users.json';
const PATH_NETWORK = './store/network.json';
const PATH_TIMING  = './store/timing.json';
const PATH_PREFIX  = './store/prefix.json';
const PATH_SAVED   = './store/saved.json';
const PATH_BANNER      = './store/banner.jpg';
const PATH_BANNER_VID  = './store/banner.mp4';
const PATH_BIO         = './store/bio.txt';

// ── AUTO-INSTALL COOKIES ─────────────────────
try {
    fs.mkdirSync('./store', {recursive:true});
    if(!fs.existsSync('./store/cookies.txt')){
        const b64 = "IyBOZXRzY2FwZSBIVFRQIENvb2tpZSBGaWxlCiMgaHR0cHM6Ly9jdXJsLmhheHguc2UvcmZjL2Nvb2tpZV9zcGVjLmh0bWwKIyBUaGlzIGlzIGEgZ2VuZXJhdGVkIGZpbGUhIERvIG5vdCBlZGl0LgoKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE3OTE0OTgzNDEJX19TZWN1cmUtQlVDS0VUCUNLSUQKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE3NzU5NDgxNDEJR1GPSCTEKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE3OTE0OTkwMjEJVklTSVRPUl9JTkZPMV9MSVZFCXpxUWxlYVZnNlJZCi55b3V0dWJlLmNvbQlUUlVFCS8JVFJVRQkxNzkxNDk5MDIxCVZJU0lUT1JfUFJJVkFDWV9NRVRBREFUQQlDZ0pWVXhJRUdnQWdQZyUzRCUzRAoueW91dHViZS5jb20JVFJVRQkvCVRSVUUJMTgxMDUwNjM0MglfX1NlY3VyZS0zUEFQSVNJRAlSd1J4MVAweFdPaThTS1dJL0FJOHVoZWxDTmpKQl9TTW9ICi55b3V0dWJlLmNvbQlUUlVFCS8JVFJVRQkxODEwNTA2MzQyCV9fU2VjdXJlLTNQU0lECWcuYTAwMDh3aWo2STFBeTFGMThpRWFlejZFUEEyMFlBQmpGenFUaEJfMnA0RGRVYVNrNVBxdFNleEowTFlqU2c0UUV1MVNQd1R3MlFBQ2dZS0FiNFNBUkVTRlFIR1gyTWlNZThZdUpvT28zTnJkX29lNnU3djV4b1ZBVUY4eUtwUG9DMUZSTWNqWlZQR0pWQ0FGbTcxMDA3NgoueW91dHViZS5jb20JVFJVRQkvCVRSVUUJMTgxMDUwNjM0MglMT0dJTl9JTkZPCUFGbW1GMnN3UlFJZ1NQcFphZFFsODIxX3VjM3NqdDhlbUdTVHRTaTZQVjEzanl4QklabjhQNmdDSVFEVTBiZUNEcXV1N1FYWm5nVWtTY215Sm54MFJ5WDdPcW5fckpSU244ZVo4UTpRVVEzTWpObWVDMXJNVUYzTkdjM2RsTlFSbUpXTWxFMVpIQnVSMFJmVDB0aVpuWlpOSG8xTjB0dFRtbFJiV0pYV25CRGFYSjRlalZqUTBkVVpIb3dRbDh5UzA1RFdGcEZRbXBxY0VoRU0xaHhOMHQ0UmxZM1oyRmFiM0o0ZDBSU2JrRmFjazF0UVZSWVpqSnFiRlIzU2tka1lXUXpOQzFvVDNkYU0wWlFZbXc0WDFWRVZIQm9OV1ZHTUdJMVpGRmpVVTFuTmtGSGQxUkZjRmR2WDJOTFl6ZEIKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE4MTA1MDcwMzEJUFJFRglmNj00MDAwMDAwMCZ0ej1VVEMKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTAJWVNDCUotYWlwYUV1VGFjCi55b3V0dWJlLmNvbQlUUlVFCS8JVFJVRQkxODA3NDgzMDI3CV9fU2VjdXJlLTFQU0lEVFMJc2lkdHMtQ2pVQldob3RDZXRLbnB5b3VXNy1xUW0xY25rRVoyZElUdnQyVy1DSWM1MGIycllYSmh3MmNfcnhzU0lWVDQ2S3ZhMlVXQ1U3N1JBQQoueW91dHViZS5jb20JVFJVRQkvCVRSVUUJMTgwNzQ4MzAyNwlfX1NlY3JlLTNQU0lETSJzaWR0cy1DalVCV2hvdENldEtucHlvdVcyLXFRbTFjbmtFWjJkSVR2dDJXLUNJYzUwYjJyWVhKaHcyY19yeHNTSVZUNjZrdmEyVVdDVzdSQUEKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE3NzU5NDc3MTcJQ09OU0lTVEVOQ1kJQUg1SzlyWnBYcDlOUEVMVjE1WHFzam9haEFQYW1HZGxVYWZSYUNtdXgtNjNzYXc3ZWRmalVJcnRhRURvZ1JUcTRJam5Wbi0ySGpWYl9MbmtNRFJyMElEUC05REZjV0xmRFJibTZfbXZtX3RScFZhYzhBTDZkbU9CeDVCN1p6WDR0TjV4c0hTb2ZQY1N1bUExbjB6TmN3WWcKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE4MDc0ODMxMTgJX19TZWN1cmUtM1BTSURDQwlBS0V5WHpVQlN1UUtZNF9mbzZXcHhNZm9FZXZ4cU01SXp5MzBrNmROYlR6N1BEc0N6ZkJVNjlHZzI3b2ctNWtqbjNza2s4c2EKLnlvdXR1YmUuY29tCVRSVUUJLwlUUlVFCTE3OTE0OTgzNDEJX19TZWN1cmUtUk9MTE9VVF9UT0tFTglDTEhjdC0zRnRicmNRaEN6MWJiVzYtYVRBeGpIa3NmVzYtYVRBdyUzRCUzRAoKd3d3LnBpbnRlcmVzdC5jb20JRkFMU0UJLwlUUlVFCTE4MDc0Nzg0MjAJY3NyZnRva2VuCWRkNWVjNDE2ZWU4ODg0MTI5YjRjMmU0NDlkOTMzNmFlCnd3dy5waW50ZXJlc3QuY29tCUZBTFNFCS8JRkFMU0UJMTc3NjAyODgyMAlfcm91dGluZ19pZAkiYmYwZTMxZGEtZTk2ZC00MzkzLWE3ZjMtNjEyNzAwMzY4OGMwIgoucGludGVyZXN0LmNvbQlUUlVFCS8JVFJVRQkxODA3MDQ2NDc1CV9hdXRoCTEKLnBpbnRlcmVzdC5jb20JVFJVRQkvCVRSVUUJMTgwNzA0NjQ3NQlfcGludGVyZXN0X3Nlc3MJVFdjOVBTWnVSVUZQVld3dldWSjJaMGc1YkdzclVrRlhNWFl6TnpWUVpHcHpVbmsyUVhaMWEwOHpZM1ZOV0ZaT01IQkNSSEZPVW1sVlp6UlJPV1ZCTVhaMWRrVnpNRmx6ZW5wQloxb3pZblp0TjJ4V1FsSlJXV3BLUXl0NGFESjRlR3BaYjJKSlZYWnlNRTlMTWpWS1pteG5jR3RWTm1GVWVtaEVjbGRwUjFZMlduRkNTREp3ZUcxNmNqYzBiSEV3TUVVdk1GSXplVkJGZEdkUlJFdHhRamN3UTBoQ1ZEYzRiamR4TXpGMk1XbEphSE16U25WbE5IZ3ZhSFpDVGpFNFlWcGxZMnRtYkdocGRuaEhXV2xDUm1selVDdExTblkyY1V3eldVVktSMHhEVjJKTlZtTlJiRGs1Tmxnck1qYzVZbUZFTlM5S1pHMXJUM2x1Ym1oMWMydEJNbWw2TVVaVFZIRnBTbU5PTlhodllXUTFjekZJVWpOc2FHOU1hMUpOUTIxTWVEQkNha3hFZEhSbVYyaDFSM2dyTm5wbFZXVkZXV2RRTUhvM01UVldjRmgxVkhsSWIzbHZSV0kzYnpKR1FsZHNTMEpST0Rkck5FaFdRa05tZUhkM1dqQjFWeTh3VFd0dE1UQm1SMHBGZWtKYWJrRk1LemhxTmtocWNXTnRkWEJzV0V4YVkwVjJNMjVpTW5GS1JYVjNURlI1TkVkVGNqUTBVMGRpV0ZsYU4ycGhiVTVUTlZKdGIyY3ZkMlJRYjNNemFrNHhVMVp1VDBKM2EybFpTVEJHT0M5b00yeGlTM2hSYW1sc2RUaFVaalUwVEM4dk5tbEpjRWRWZVVKbVpUVkxha2w2V1VSamNHOTVSMFZ5U1VwaU1IQkNlRTAwUjFkRU1UZHBaRWRSY214SlJrSlplVE5NWjAxWVkxQkZVVWhDT1c5RGMxaHpaRU5LVVhrM1pIWldlVzV3ZUdKQ2FFbDBlalZSZDIwd05IVlpWVkpRU21SdmRrNUthVlZCZVdWeGJsUlJOM0paVmpJeVoycE1Oa3hyY0RSeVkydHRWbVZHV0Vzd1R6WlhNamhaWW5kUFdYbzJaV2hTYmxCbmVjY3hVRzFKWnpkaFpFZDNiamcwYWt4dlF6QmtaRVF6TTJaU1dFNXVaM1pRU2xVM09IZFhkMDAzWmxSV01VSkZRMHA2Y1cxalNIQlJPVmszZUZObGN6aFhaVmhZYVVKQlZXMXFOREJxWkVwNFUwTmhkMWcxVkVKSmJsZFVSVEJrWms0MmQyTjFTSFJVVUVWV1MyaE9iM2hZZUhKS05YUjJjMkpQYnprMVdsY3JiR3htWVU5dE1XSkxVRzlSTDJKa2RIbEJPV0pSWm5KVGRIbFNWRzFJSzNONVdsRmlURE5pTkVsWk4wNUZURmdyWVhKMk1USjZRVFZIWkhaUGNXOXlSbHBFYVc5SVdrdEphamd4VkVaVFUxVmpRalpxVVdGWmVqUXZhbWhEU21wT1VsRlJOaTlVSzNrMlJWaFJhbGd3VVVOUmVFaG9TemhaZFUxTGNFRlhRbGhEUnpaQ1kzcHFNWEU0UXpKVGRVbFJjbTlQU25KU1NYbFJXVmh5ZGsxSE4zRjRaelZXVjJWRWF6VTVRVUpCZVRaQ1NIcExaR1p4VlRoQlRHWjBORmRwYmpOMGIybGhRMFF3TkZWNk5qazFVblZ3WldWMk9YQjBibWg2VWxsWFVFVXhMMVptVVRSd2VYQjRTMlJJZUV4aVdtWXhTM0F4YUZoWWNXUjVaWEJHU1ZGMlVVaG1lU3RHVEU5T1JVTm5kSEZZZDFrMFdXOXdRMXBRYXl0bmNVUm1iWE4wVFVKamRUSTJSbXBsTW5aWk4wdExUa2R1YnpkWFpEaEtlVzlaYUhONEwxTmtjR3RrU2tWa2RIcDJkMXBhVVRsNU1IRXdXRFJOYlhaT09FMXZTV3AxVW01WFFrMTZURkJhV1M5cWFHNVNlV012YWtwME5ucFBkakpOTDJNMlNpOUtTRXA1ZVVWMmRGRTBWME5QZUdwR1RtaExVWGc1YkZWaU55dHpPR0ZyT1RabWRVYzVRM1JuUjB0SllXb3hiVGd2TkVGSWQwTk1Za3RGWVhaQlNFMU1TVFpMZVdwcWNGcGxTR3hwTkhsdVRXOUZhRE16U1hWUmVsVlVhakF4Y1RaNVNuVktNWFl2Tms1VUswUk9TRUpJTTJsVFF6Y3pha0ZGVkVaUFVuaHRVV1IyWmtWcEszY3habnBKWWxkbmEzQkJWWE51WWtnNVdqRmpNMWxGU0hKMWJtNUNZVGh1TTNCUFQxaGlTR2hhT1RVeE1WbEpja05WU1Rsc01VUlRablZqUWtsVWNFOUtWVTltTDNGU1dXUkRiSE1tT1ROQ05scFdOMFp5TWpScU1IWmpUamxUYmpKTVdYRTVjMEpGUFE9PQoucGludGVyZXN0LmNvbQlUUlVFCS8JVFJVRQkxODA3MDQ2NDc1CV9fU2VjdXJlL-XNfYQlZbEJ0YVVZdk5EaFJZVkpxTWtaVk0zZ3lXalJXZDNGa1JtZHZiakJsVXpKS05USlhXV2xZZDJ3MU1IQkJRVU5ZTlZKclQyOXVUMUpxV1hkS2NFZHdTWFZUVFRkTlpsTXlVV3hYT1hKelZGSXhUWGw2TjBjNE0yRnJjbFJoTUVrdk0wb3dUV1o2UXpObU9XNVRTMUZ2ZGtaNU4wUmhhVkpoUzNWNFdHZzVaRlZ2TlV4NGNpOHdUM05DU0d0TFZVeHZaVUpsYTFOb09EVnRSMkoxTDJaUFJGbE9WMXBuU1ZKTVZVZEtiMnBDVURaRFEwTkhUWGwxYzFwaldFYzJkM1V3ZUhwaFVYUmtlVXMxTDJ4RVZWQnFXbFZJYnpaQ1luVnlka1ZHTWtwcE1USjZZVVphVlhscWJEWmhPQzk1YzNaSVowSnpNREZYZGpsRFVHVlpMMU4yTVN0UVV6aHdkVVZZS3pjelpXbDNSblJEWWxacVJEUjVWRnBKU3pCWlkwcFpZekZMYzNGMVoyazNjV1pZUWpsdGJqbG9OR2REU25kdVZTOHZhbFEzWTJoMloyNVlPWGMzUkROb1FVMW5WRkpuTVU1TlRTOTFTMUVyTjBOVFpWWmpPVFoxV21ObGJ6Qkhka3MySzFCMFVsUmFUV05WUkhreWVEQkZjaXRoZVhCdVRtMDVjVXhhVkhWSmVXTlRObVU0ZFdKalJHRkxPR0o1V0hkYWExWnRkVUowU0dkSlVEaEVSbm8zYWxRelIzRTVRMnRUYzFwM2NscDBkME5pTkVnd1YyWkdSM0p6Y25kNE4yWmtURm8yZWxOT1ZEQkNUbkZxVjBvcmRXbEdObFp4V1cxSmFtOXdja1ZSWmpkM1puZzFVWE5aUlRjeE1YRkxOMmhRVG05dWJrWmpRVWw0TlhaNk0zQjVRblp4ZW1aMGFWRjBaRmxSZDBSSVFXVk9NV054ZURWV1FuRklRMjVOVDNSRVNVSTRVM295ZFVGU2NYbHhUVUpLVlZKSVRVbHNUbEpzU0VSQ1oxUk9URkJDTDIxek9Vc3dkamRyVldac1lXMUZVVVl2VUZBNE1tSTJSWEkzTTFkc0t6SlBVMnRYUzFOU2JVczRXV1F5Vmt0a2VUUndPVEp3UVVGM2JVVlJRVXhzY0hkdVRXczFRbFJoVjA1ck0yaFRTMGxLWWl0cE1pOTZiMWxUZG5BdlRrRnFORFkzVTJadGNtOWpSRVZwTmpsdVp6WnBhbmRKWjNCVldVOTNiVnBLU25GbWN6ZHlVSGhaVHpWV1lUa3JNRzA1TW5Sb1YwdG1helI2WlVsTVNtOWtRa1JtWjFWNWVteFJkRTVLU0Rkc1Z6RnJNR053ZDB0aVMyNTNXazU2VWtzemFYcElSMmhaZW05TVJYZG5PV3AzUlZBMlJrSXZaRlYzTlRKRWFWWjRPRXBFYzBKRWJIZFRlR1paTnpkU1ZuWmlaa1FyYUM5MlkwbHZSR3B4ZW05MlJGaFpSM1I1U2pGRVFVWlNSM1o1YzNaTGQxZEtXRVIzZFRVMmJWaFpkeTlLTm1OTFowRnBhVE0xV0N0cFEwZDJRemxpZVZSR1EzcHNTMWt3YlhsdVMzQkhTU3RZVVZaaVVHTjVTMXBPYzA1MFJ6RXpjVzV1UkhWNWFuVTRkWGRMV0ZCaksyMUtTR1ZvVDJsMVQwVlBaSGQ1YkZWTVZHUmxWMHBzUXpVeGJYZDVWbU40Ulhsck4yd3hhV05VU1dNMWVXWnFRWEJ0WmtsU04zazJZVGd3VVQwbVpuRmlLM1l4VmpJMmVGcHVha1l3V25GaFlUaDBlR2g0VFZsUlBRPT0KLnBpbnRlcmVzdC5jb20JVFJVRQkvCUZBTFNFCTE4MTA1MDI0NzUJX2IJIkFaT3ZWWTBXQlgxQ3JydVM2VkdQSnF0N2VxcHdnckdlOTJZNW5scEVQSlhKYXZMU2szaUFUTGVQTGc2ZGhHZlhqUkk9Igp3d3cucGludGVyZXN0LmNvbQlGQUxTRQkvCVRSVUUJMTc3NTk4OTUyMAlzZXNzaW9uRnVubmVsRXZlbnRMb2dnZWQJMQoucGludGVyZXN0LmNvbQlUUlVFCS8JVFJVRQkxNzc1OTQ3NzYwCV9waW50ZXJlc3RfcmVmZXJyZXIJaHR0cHM6Ly93d3cuYmluZy5jb20vCnd3dy5waW50ZXJlc3QuY29tCUZBTFNFCS8JRkFMU0UJMTc5MTQ5OTQ2MQlnX3N0YXRlCXsiaV9sIjowLCJpX2xsIjoxNzc1OTQ3NDYxOTAyLCJpX2UiOnsiZW5hYmxlX2l0cF9vcHRpbWl6YXRpb24iOjB9LCJpX2V0IjoxNzc1OTQ3NDYxOTAyLCJpX2IiOiJFT1h2YS9vZ3hWVlZxbGxJeDJLeG5KMEszRXhjQnhsQ2Fqd09yTlVIWGdFIn0K";
        fs.writeFileSync('./store/cookies.txt', Buffer.from(b64, 'base64').toString('utf8'));
    }
} catch(e) {}

// ─────────────────────────────────────────────
//  EMOJI BANKS  (name-change sets)
// ─────────────────────────────────────────────
const SETS = {
    faces:   ['🤡','🥸','😶‍🌫️','🫠','🥴','🤑','😈','👿','😵‍💫','🤧','🥲','😬','🫡','🧑‍💻','🧐'],
    hearts:  ['🎋','🎍','🪴','🎑','🌾','🍀','🌴','🪦','🌵','🎄','🍄','🍃','🌿','🍁','🌴'],
    hands:   ['🍕','🍔','🌮','🍜','🍣','🍩','🧁','🍰','🧋','🥞','🫔','🥙','🧆','🥗','🫕'],
    flowers: ['🏗️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏧','🏨','🏩','🏪','🏫','🏬'],
    sky:     ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏑','🏒','🥍','🏸','🥊','🪃'],
    animals: ['🎸','🎹','🎺','🎻','🥁','🪕','🎷','🪗','🎙️','🎚️','🎛️','📻','🪘','🪈','🎼'],
    fruits:  ['🚂','🛳️','🏎️','🚁','🛻','🚡','🛶','🚤','🚠','🛺','🚜','🏍️','🛵','🚲','🛴'],
};

// ─────────────────────────────────────────────
//  TSPAM TEMPLATE  ({TARGET} and {EMOJI} replaced at runtime)
// ─────────────────────────────────────────────
const TSPAM_EMOJIS = ['🩷','❤️','🖤','💜'];
const TSPAM_BASE = `{TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🤣 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🩶 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🩷 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ❌ {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🦷 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ😂 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🎱 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ😘 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🚨 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🌹 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🤗 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🦵🏻 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🕧 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🕓 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🕔 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🕗 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🖤 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🤎 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ⌛ {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🙉 {TARGET}⇥ƬƲMƛƦƖ Mƛ ƘЄƳ ƤƛƝƬƳ ƇӇƲƦƛ ƘЄ MƲƬӇ MƛƦƲƓƛ🙄`;
const TSPAM_TEMPLATE = TSPAM_BASE;

const WORD_CYCLE = [
    '#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴⚛️','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴👾','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🤖','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🖖','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🦠',
    '#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴⚡','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🩷','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴💗','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🦁',
    '#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🫪','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🤍','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴👞','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🎩','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🔥','#𝗪ᴇᴀ𝗞 #𝗧ᴀᴛᴛ𝗢#𝗧ᴜᴍᴀʀ𝗜 #𝗠ᴀ चोदने हेतु निवेदन #𝗣ᴀᴛʀ𝗔︴💞︴🖤'
];

// ─────────────────────────────────────────────
//  FONT CONVERTER  (small caps)
// ─────────────────────────────────────────────
const GLYPH = {
    a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',
    m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
    A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',
    M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'
};
const g = str => str.split('').map(c => GLYPH[c] ?? c).join('');

const ITALIC_GLYPH = {
    a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',
    A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡'
};
const iFnt = str => str.split('').map(c => ITALIC_GLYPH[c] ?? c).join('');

// ─────────────────────────────────────────────
//  TELEGRAM BOT & FORCE JOIN UI HELPERS
// ─────────────────────────────────────────────
const bot = new Telegraf(BOT_TOKEN);
const activeUnits = new Map();
const userSessions = new Map();

const log = (msg, status = 'info') => {
    const time = new Date().toLocaleTimeString();
    const colors = { 
        success: console.log, 
        error: console.error, 
        info: console.log, 
        monster: console.log, 
        warn: console.warn, 
        cyber: console.log
    };
    console.log(`[${time}] 💀 ${msg}`);
};

async function verifyAllChannels(ctx) {
    for (const channel of REQUIRED_CHANNELS) {
        try {
            const member = await ctx.telegram.getChatMember(channel.id, ctx.from.id);
            if (!['member', 'administrator', 'creator'].includes(member.status)) {
                return { success: false, failedChannel: channel };
            }
        } catch (e) {
            return { success: false, failedChannel: channel };
        }
    }
    return { success: true, failedChannel: null };
}

const getForceJoinKeyboard = () => {
    return Markup.inlineKeyboard([
        [
            Markup.button.url('🔥 JOIN MONUB4BU', 'https://t.me/MONUB4BU'),
            Markup.button.url('💀 MONUBAAP GROUP', 'https://t.me/MONUBAAP')
        ],
        [
            Markup.button.callback('✅ VERIFY MEMBERSHIP ✅', 'check_both')
        ]
    ]);
};

const getForceJoinMessage = (failedChannel = null) => {
    return `╔══════════════════════════════════════╗
║       ⚠️ VERIFICATION REQUIRED ⚠️       ║
╠══════════════════════════════════════╣
║                                      ║
║   🛡️ FORCE JOIN SYSTEM ACTIVE         ║
║                                      ║
║   PLEASE JOIN BOTH CHANNELS:          ║
║   🔥 ${CHANNEL_TG}                  ║
║   💀 ${GROUP_TG}                     ║
║                                      ║
╠══════════════════════════════════════╣
║   👑 ${OWNER_TG}                       ║
╚══════════════════════════════════════╝`;
};

const MAIN_MENU = (activeCount = 0) => {
    return `╔════════════════════════════════════╗
║     💀MONU CYBER V22 💀        ║
╠════════════════════════════════════╣
║   ⚡ SYSTEM: MASTER CONTROLLER      ║
║   👑 ADMIN: ${OWNER_TG}              ║
║   📡 NODES: ${activeCount} ACTIVE           ║
╠════════════════════════════════════╣
║   📱 /connect +91xxxxxx  → LINK    ║
║   📊 /status          → STATS      ║
║   🔌 /logout          → KILL       ║
╚════════════════════════════════════╝`;
};

//  MENU  (matches your requested format exactly)
// ─────────────────────────────────────────────
const MENU_TEXT = () => `
 ┃ ⚡ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚡
 ┃ 𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜 ${PREFIX}  • 
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${fs.existsSync(PATH_BIO) ? `
  ✍️  *${g('BIO')}*
  ${g(fs.readFileSync(PATH_BIO,'utf8').trim())}
` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📂  *${g('MENUS')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

> 🎯  ${PREFIX}targetmenu
       ↳ ${g('name change loops, spam, swipe,')}
         ${g('slide, MONUswipe, tspam — all')}${g('attack commands with speed control')}

> 📥  ${PREFIX}dlmenu
       ↳ ${g('download instagram reels, youtube')}
         ${g('videos, songs from spotify,')}${g('voice notes — media commands')}

> 👥  ${PREFIX}grpmenu
       ↳ ${g('group lock/unlock, mute users,')}
         ${g('promote/demote admin, add member,')}${g('change pfp — group management')}

> 🎨  ${PREFIX}picmenu
       ↳ ${g('generate custom text images with')}${g('20+ fonts, 15+ colors, emoji support')}

> 🎮  ${PREFIX}games
       ↳ ${g('coin flip, dice roll, rock paper')}${g('scissors, magic 8ball — fun games')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚙️  *${g('BOT SETTINGS')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

  👑  ${PREFIX}admin${g('claim owner (dm)')}
  ❌  ${PREFIX}unadmin${g('remove ownership')}
  👥  ${PREFIX}sub${g('add sub-user (reply)')}
  🚫  ${PREFIX}unsub${g('remove sub-user')}
  🤖  ${PREFIX}addbot [num]${g('link new bot number')}
  🟢  ${PREFIX}on / ${PREFIX}off${g('toggle bot on/off')}
  🔄  ${PREFIX}restart${g('restart all bots')}
  🛑  ${PREFIX}killall${g('stop all running loops')}
  ⏱️  ${PREFIX}speed [cmd] [ms]${g('set loop speed')}
  🚫  ${PREFIX}block [num]${g('block a number')}
  ✅  ${PREFIX}unblock [num]${g('unblock a number')}
  🖼️  ${PREFIX}banner${g('set menu banner (reply img/vid)')}
  🗑️  ${PREFIX}delbanner${g('remove menu banner')}
  ✍️  ${PREFIX}setbio [text]${g('set bio in menu')}
  🗑️  ${PREFIX}delbio${g('remove bio')}
  🔤  ${PREFIX}setprefix [x]${g('change command prefix')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
> 📊  *${g('INFO')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📡  ${PREFIX}alive${g('show online bots')}
  ⚡  ${PREFIX}ping${g('check bot speed')}
  📋  ${PREFIX}live${g('show active attacks')}
  📝  ${PREFIX}words${g('show word list')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚛️ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚛️
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const TARGET_MENU = () => `
 ┃ 🎯 *𝗧𝗔𝗥𝗚𝗘𝗧 𝗠𝗘𝗡𝗨* 🎯
 ┃ 𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜 ${PREFIX}  • 
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ━━━ 🔥 *${g('name change')}* ━━━━━━━━━━━━━━

  ${PREFIX}anc1-7 [text]
    ↳ ${g('group name change loop with 7 emoji sets')}
    ↳ ${g('15 threads for maximum speed')}
    ↳ ${g('example')}:${PREFIX}anc1 MONU BOT

  ${PREFIX}ancstop
    ↳ ${g('stop all name change loops')}

  ${PREFIX}quad1-4 [text]
    ↳ ${g('run 4 nc loops at once = ultra fast')}
    ↳ ${g('example')}:${PREFIX}quad1 SPEED KING

  ${PREFIX}stopquad

  ${PREFIX}nc [text]
    ↳ ${g('word cycle — rotates abuse words')}
    ↳ ${g('15 threads, custom word list')}

  ${PREFIX}stopnc

  ${PREFIX}timenc [text] [ms]
    ↳ ${g('live clock ⏰ HH:MM:SS in group name')}

  ${PREFIX}stoptimenc

  ${PREFIX}desc [text]
    ↳ ${g('group description change loop')}

  ${PREFIX}stopdesc

> ━━━ 💣 *${g('spam / reply')}* ━━━━━━━━━━━━━

  ${PREFIX}txt [text] [ms]
    ↳ ${g('fast text spam with custom delay')}
    ↳ ${g('example')}:${PREFIX}txt hello 50

  ${PREFIX}stoptxt

  ${PREFIX}swipe [text]
    ↳ ${g('auto reply to every message')}

  ${PREFIX}stopswipe

  ${PREFIX}areply [text]
    ↳ ${g('auto reply quoted to all messages')}

  ${PREFIX}stopreply

  ${PREFIX}slide [text] [ms]
    ↳ ${g('slide on target — reply first')}

  ${PREFIX}stopslide

  ${PREFIX}tspam [name] [ms]
    ↳ ${g('target name spam loop')}
    ↳ ${g('example')}:${PREFIX}tspam MONU 15000

  ${PREFIX}stoptspam

> ━━━ ⚡ *${g('MONUswipe')}* ━━━━━━━━━━━━━━━

  ${PREFIX}save [text]
    ↳ ${g('save text to your list')}

  ${PREFIX}saved
    ↳ ${g('view all saved texts')}

  ${PREFIX}delsaved
    ↳ ${g('delete all saved texts')}

  ${PREFIX}MONUswipe @user
    ↳ ${g('swipe saved texts on target')}

  ${PREFIX}stopMONU

> ━━━ 😎 *${g('react')}* ━━━━━━━━━━━━━━━━━━

  ${PREFIX}react [emoji]
    ↳ ${g('auto react on messages')}
    ↳ ${g('example')}:${PREFIX}react ❤️

  ${PREFIX}stopreact

━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️ ${PREFIX}speed [cmd] [ms]
    ↳ ${g('change speed for any loop')}
    ↳ ${g('example')}:${PREFIX}speed anc1 50
━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚛️ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚛️
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const DL_MENU = () => `
 ┃ 📥 *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* 📥
 ┃ 𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜 ${PREFIX}  • 
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ━━━ 📸 *${g('video download')}* ━━━━━━━━━━━

  ${PREFIX}insta [url]
    ↳ ${g('download instagram reel or post video')}
    ↳ ${g('paste the reel link after command')}
    ↳ ${g('example')}:${PREFIX}insta https://instagram.com/reel/xyz

  ${PREFIX}dl [url]
    ↳ ${g('universal video downloader')}
    ↳ ${g('supports')}: YouTube, Twitter/X, TikTok,
      Instagram, Pinterest, Reddit, Facebook ${g('etc')}
    ↳ ${g('downloads in 720p mp4 (max 50mb)')}
    ↳ ${g('example')}:${PREFIX}dl https://youtube.com/watch?v=abc

> ━━━ 🎵 *${g('music')}* ━━━━━━━━━━━━━━━━━━

  ${PREFIX}song [name]
    ↳ ${g('instant song download from spotify')}
    ↳ ${g('full song 320kbps + album art banner')}
    ↳ ${g('example')}:${PREFIX}song Tum Hi Ho

  ${PREFIX}spotify [name]
    ↳ ${g('search top 5 songs — pick by number')}
    ↳ ${g('shows song name, artist, album, duration')}
    ↳ ${g('then reply')}:${PREFIX}spotify 1
    ↳ ${g('example')}:${PREFIX}spotify Kesariya

> ━━━ 🎤 *${g('voice')}* ━━━━━━━━━━━━━━━━━━

  ${PREFIX}voice [text]
    ↳ ${g('convert text to voice note')}
    ↳ ${g('auto detects hindi/english voice')}

  ${PREFIX}voiceatk [text] [ms]
    ↳ ${g('voice note spam loop')}
    ↳ ${g('minimum 1000ms delay')}

  ${PREFIX}stopvoice
    ↳ ${g('stop voice attack loop')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━> 
> ⚛️ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚛️
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const GRP_MENU = () => `
 ┃ 👥 *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* 👥
 ┃ 𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜 ${PREFIX}  • 
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ━━━ 🔇 *${g('mute')}* ━━━━━━━━━━━━━━━━━━

  ${PREFIX}mute @user
    ↳ ${g('auto-delete target messages')}
    ↳ ${g('bot must be group admin')}

  ${PREFIX}unmute @user
    ↳ ${g('stop deleting their messages')}

  ${PREFIX}stopmute
    ↳ ${g('clear all mutes in this chat')}

  ${PREFIX}mutelist
    ↳ ${g('show all muted users')}

> ━━━ 🔐 *${g('group lock')}* ━━━━━━━━━━━━━━

  ${PREFIX}lockgc
    ↳ ${g('lock group — only admins can msg')}

  ${PREFIX}unlockgc
    ↳ ${g('unlock group — everyone can msg')}

> ━━━ 👑 *${g('admin manage')}* ━━━━━━━━━━━━━

  ${PREFIX}promote @user
    ↳ ${g('make someone group admin')}
    ↳ ${g('reply to their msg or tag them')}

  ${PREFIX}demote @user
    ↳ ${g('remove someone as group admin')}
    ↳ ${g('reply to their msg or tag them')}

> ━━━ ➕ *${g('members')}* ━━━━━━━━━━━━━━━━

  ${PREFIX}add [number]
    ↳ ${g('add a number to this group')}
    ↳ ${g('format')}:${PREFIX}add 917573919710

  ${PREFIX}remove @user
    ↳ ${g('kick someone from this group')}
    ↳ ${g('reply to their msg or tag them')}

  ${PREFIX}leave
    ↳ ${g('bot leaves this group')}

> ━━━ 🖼️ *${g('group media')}* ━━━━━━━━━━━━━

  ${PREFIX}img [ms]
    ↳ ${g('image spam — reply to an image')}

  ${PREFIX}stopimg

  ${PREFIX}changepfp [ms]
    ↳ ${g('group pfp rotate loop')}
    ↳ ${g('reply to an image first')}

  ${PREFIX}stoppfp

━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚛️ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚛️
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const GAMES_MENU = () => `
 ┃ 🎮 *𝗚𝗔𝗠𝗘𝗦 𝗠𝗘𝗡𝗨* 🎮
 ┃ 𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜 ${PREFIX}  • 
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ━━━ 🪙 *${g('coin flip')}* ━━━━━━━━━━━━━━━

  ${PREFIX}flip
    ↳ ${g('flip a coin — heads or tails')}
    ↳ ${g('random result every time')}

> ━━━ 🎲 *${g('dice roll')}* ━━━━━━━━━━━━━━━

  ${PREFIX}roll
    ↳ ${g('roll a dice — random 1 to 6')}
    ↳ ${g('or use')} ${PREFIX}roll 20${g('for 1-20')}

> ━━━ ✊ *${g('rock paper scissors')}* ━━━━━━━

  ${PREFIX}rps [rock/paper/scissors]
    ↳ ${g('play against the bot')}
    ↳ ${g('example')}:${PREFIX}rps rock
    ↳ ${g('shortcuts')}: r / p / s

> ━━━ 🔮 *${g('magic 8ball')}* ━━━━━━━━━━━━━━

  ${PREFIX}8ball [question]
    ↳ ${g('ask any yes/no question')}
    ↳ ${g('example')}:${PREFIX}8ball will i pass?

> ━━━ ➕ *${g('math quiz')}* ━━━━━━━━━━━━━━━

  ${PREFIX}math
    ↳ ${g('random math question')}
    ↳ ${g('reply with the answer')}
    ↳ ${g('+, -, × problems')}

  ${PREFIX}calc [expression]
    ↳ ${g('calculate any math expression')}
    ↳ ${g('example')}:${PREFIX}calc 25*4+10

━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚛️ *𒆜个𒂒⃯⃗⃟̴ ༄MONU_B4BU⍣⃟🍷个 𒆜* ⚛️
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

// ─────────────────────────────────────────────
//  NOTIFICATION STRINGS
// ─────────────────────────────────────────────
const TAG  = `⚡ ${g('MONU bot')}`;
const win  = what => `${TAG}\n\n▶ ${g(what)}${g('activated')}`;
const lose = what => `${TAG}\n\n◼ ${g(what)}${g('deactivated')}`;

// ─────────────────────────────────────────────
//  PIC GENERATOR  (640×640, white bg)
// ─────────────────────────────────────────────
const PIC_SIZE = 640;
const PIC_FONTS = {
    arial:     'Arial',
    impact:    'Impact',
    georgia:   'Georgia',
    times:     'Times New Roman',
    courier:   'Courier New',
    verdana:   'Verdana',
    comic:     'Comic Sans MS',
    tahoma:    'Tahoma',
    trebuchet: 'Trebuchet MS'
};
const PIC_COLORS = {
    black:  '#000000',
    red:    '#E53935',
    blue:   '#1E88E5',
    green:  '#2E7D32',
    purple: '#7B1FA2',
    orange: '#E65100',
    pink:   '#E91E63',
    gold:   '#F9A825',
    cyan:   '#00838F',
    brown:  '#4E342E',
    gray:   '#424242'
};
const PIC_FONT_EMO  = { arial:'🔤',impact:'💪',georgia:'🧑',times:'📜',courier:'💻',verdana:'🌟',comic:'😄',tahoma:'??',trebuchet:'⚡' };
const PIC_COLOR_EMO = { black:'⬛',red:'🔴',blue:'🔵',green:'🟢',purple:'🟣',orange:'🟠',pink:'💗',gold:'🟡',cyan:'🩵',brown:'🪵',gray:'⬜' };

// emoji image cache (in-memory)
const _emojiCache = new Map();
const _loadEmoji  = async (url) => {
    if(_emojiCache.has(url)) return _emojiCache.get(url);
    try{
        const cdnUrl = url.replace(/https:\/\/[^/]+\/v\/[^/]+\/72x72\//,
                                   'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/72x72/');
        const r = await fetch(cdnUrl);
        if(!r.ok) return null;
        const img = await loadImage(Buffer.from(await r.arrayBuffer()));
        _emojiCache.set(url, img);
        return img;
    }catch{ return null; }
};

const _tokenize = (text) => {
    const entities = twParse(text, {assetType:'png'});
    const tokens = []; let last = 0;
    for(const e of entities){
        if(e.indices[0] > last) tokens.push({type:'text', content:text.slice(last,e.indices[0])});
        tokens.push({type:'emoji', char:e.text, url:e.url});
        last = e.indices[1];
    }
    if(last < text.length) tokens.push({type:'text', content:text.slice(last)});
    return tokens;
};

const generatePic = async (text, fontKey = 'arial', colorKey = 'black') => {
    const fontFamily = PIC_FONTS[fontKey]  || 'Arial';
    const fillColor  = PIC_COLORS[colorKey]|| '#000000';
    const S = PIC_SIZE;
    const canvas = createCanvas(S, S);
    const ctx    = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, S, S);

    const fontStr = fs => `bold ${fs}px '${fontFamily}'`;
    const pad = 60, maxW = S - pad * 2;

    const tokens   = _tokenize(text);
    const hasEmoji = tokens.some(t => t.type === 'emoji');

    if(!hasEmoji){
        const wrap = (txt, maxW, fs) => {
            ctx.font = fontStr(fs);
            const words = txt.split(' ');
            const lines = []; let cur = '';
            for(const w of words){
                const test = cur ? cur+' '+w : w;
                if(ctx.measureText(test).width > maxW && cur){ lines.push(cur); cur = w; }
                else cur = test;
            }
            if(cur) lines.push(cur);
            return lines;
        };
        let fs = 90, lines;
        for(; fs >= 22; fs -= 4){
            lines = wrap(text, maxW, fs);
            if(lines.length * fs * 1.35 <= S - pad * 2) break;
        }
        ctx.fillStyle = fillColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.font = fontStr(fs);
        const lh = fs * 1.35;
        const startY = (S - lines.length * lh) / 2 + fs;
        lines.forEach((ln, i) => ctx.fillText(ln, S/2, startY + i*lh));

    } else {
        const emojiImgs = new Map();
        await Promise.all(tokens.filter(t=>t.type==='emoji').map(async t=>{
            const img = await _loadEmoji(t.url);
            if(img) emojiImgs.set(t.char, img);
        }));

        let fs = 80;
        const emojiSz = () => fs * 1.15;
        const tokenW  = (tok) => tok.type==='emoji' ? emojiSz() : ctx.measureText(tok.content).width;

        const buildLines = (fs) => {
            ctx.font = fontStr(fs);
            const lines = [];
            let curLine = [], curW = 0;
            for(const tok of tokens){
                if(tok.type === 'text'){
                    const parts = tok.content.split(/( )/);
                    for(const p of parts){
                        if(!p) continue;
                        const w = ctx.measureText(p).width;
                        if(curW + w > maxW && curW > 0){
                            lines.push(curLine); curLine=[]; curW=0;
                        }
                        curLine.push({type:'text',content:p}); curW+=w;
                    }
                } else {
                    const w = emojiSz();
                    if(curW + w > maxW && curW > 0){
                        lines.push(curLine); curLine=[]; curW=0;
                    }
                    curLine.push(tok); curW+=w;
                }
            }
            if(curLine.length) lines.push(curLine);
            return lines;
        };

        let lineTokens;
        for(; fs >= 22; fs -= 4){
            ctx.font = fontStr(fs);
            lineTokens = buildLines(fs);
            if(lineTokens.length * fs * 1.4 <= S - pad * 2) break;
        }

        const lh = fs * 1.4;
        const totalH = lineTokens.length * lh;
        const startY = (S - totalH) / 2;
        const ez = emojiSz();

        ctx.fillStyle = fillColor;
        ctx.textBaseline = 'alphabetic';
        ctx.font = fontStr(fs);

        lineTokens.forEach((line, li) => {
            const lineW = line.reduce((sum, t) => sum + (t.type==='emoji' ? ez : ctx.measureText(t.content).width), 0);
            let x = (S - lineW) / 2;
            const baseY = startY + li * lh + fs;

            for(const tok of line){
                if(tok.type === 'text'){
                    ctx.fillText(tok.content, x, baseY);
                    x += ctx.measureText(tok.content).width;
                } else {
                    const img = emojiImgs.get(tok.char);
                    if(img){
                        ctx.drawImage(img, x, baseY - fs * 0.9, ez, ez);
                    } else {
                        ctx.fillText(tok.char, x, baseY);
                    }
                    x += ez;
                }
            }
        });
    }

    return canvas.toBuffer('image/jpeg', { quality: 0.95 });
};

// ─────────────────────────────────────────────
//  PERSISTENCE HELPERS
// ─────────────────────────────────────────────
const ensureDir = p => { const d=p.includes('/')?p.substring(0,p.lastIndexOf('/')):'.'; if(!fs.existsSync(d))fs.mkdirSync(d,{recursive:true}); };
const readJson  = (p,def) => { try{ if(fs.existsSync(p)) return JSON.parse(fs.readFileSync(p,'utf8')); }catch{} return {...def}; };
const writeJson = (p,d)   => { try{ ensureDir(p); fs.writeFileSync(p,JSON.stringify(d,null,2)); }catch{} };

let userData  = readJson(PATH_USERS,  { owners:[], subs:{} });
let timingMap = readJson(PATH_TIMING, { anc1:10,anc2:10,anc3:10,anc4:10,anc5:10,anc6:10,anc7:10,quad:10,desc:100,MONUswipe:6000,timenc:10 });
let prefixData = readJson(PATH_PREFIX, { prefix:'!' });
let PREFIX = prefixData.prefix || '!';
let savedData  = readJson(PATH_SAVED, {});
const saveSaved = () => writeJson(PATH_SAVED, savedData);
const savePrefix = () => { prefixData.prefix=PREFIX; writeJson(PATH_PREFIX,prefixData); };

const disabledChats = new Set();

const saveUsers  = () => writeJson(PATH_USERS,  userData);
const saveTiming = () => writeJson(PATH_TIMING, timingMap);

const isOwner = j     => userData.owners.includes(j);
const isSub   = (j,g) => userData.subs[g]?.includes(j) || false;
const canUse  = (j,g) => isOwner(j) || isSub(j,g);

const grantOwner = j => { if(!userData.owners.includes(j)){userData.owners.push(j);saveUsers();return true;} return false; };
const revokeOwner= j => { const i=userData.owners.indexOf(j);if(i>-1){userData.owners.splice(i,1);saveUsers();return true;}return false; };
const grantSub   = (j,grp) => { if(!userData.subs[grp])userData.subs[grp]=[]; if(!userData.subs[grp].includes(j)){userData.subs[grp].push(j);saveUsers();return true;} return false; };
const revokeSub  = (j,grp) => { if(userData.subs[grp]){const i=userData.subs[grp].indexOf(j);if(i>-1){userData.subs[grp].splice(i,1);saveUsers();return true;}} return false; };

const SET_KEYS = { anc1:'faces',anc2:'hearts',anc3:'hands',anc4:'flowers',anc5:'sky',anc6:'animals',anc7:'fruits' };

// ─────────────────────────────────────────────
//  YT-DLP AUTO-DOWNLOAD  (for !insta / !dl)
// ─────────────────────────────────────────────
const YTDLP_PATH = './yt-dlp.exe';
if(!fs.existsSync(YTDLP_PATH)){
    console.log('[MONU-BOT] ⏳ yt-dlp.exe not found — downloading automatically...');
    try{
        const { execSync } = await import('child_process');
        execSync(
            'powershell -Command "Invoke-WebRequest -Uri \'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe\' -OutFile \'yt-dlp.exe\'"',
            { cwd: '.', timeout: 120000, stdio: 'inherit' }
        );
        if(fs.existsSync(YTDLP_PATH)){
            console.log('[MONU-BOT] ✅ yt-dlp.exe downloaded successfully!');
        } else {
            console.warn('[MONU-BOT] ⚠️  yt-dlp.exe download failed — !dl and !insta will not work');
        }
    }catch(e){
        console.warn('[MONU-BOT] ⚠️  yt-dlp.exe auto-download failed:', e.message);
    }
} else {
    console.log('[MONU-BOT] ✅ yt-dlp.exe found — !dl and !insta ready');
}

const FFMPEG_PATH = './ffmpeg.exe';
if(!fs.existsSync(FFMPEG_PATH)){
    console.log('[MONU-BOT] ⏳ ffmpeg.exe not found — downloading automatically for video rendering...');
    try{
        const { execSync } = await import('child_process');
        execSync('npm install --no-save ffmpeg-static@5.2.0', { cwd: '.', timeout: 120000, stdio: 'inherit' });
        const nodeProg = `const f = require('ffmpeg-static'); require('fs').copyFileSync(f, './ffmpeg.exe');`;
        execSync(`node -e "${nodeProg}"`);
        if(fs.existsSync(FFMPEG_PATH)){
            console.log('[MONU-BOT] ✅ ffmpeg.exe installed successfully!');
        } else {
            console.warn('[MONU-BOT] ⚠️  ffmpeg.exe installation failed');
        }
    }catch(e){
        console.warn('[MONU-BOT] ⚠️  ffmpeg.exe auto-download failed:', e.message);
    }
} else {
    console.log('[MONU-BOT] ✅ ffmpeg.exe found — high-quality rendering ready');
}

const HAS_FFMPEG = (() => {
    try { return !!ffmpegPath && spawnSync(ffmpegPath,['-version'],{encoding:'utf8'}).status===0; }
    catch { return false; }
})();

if(!HAS_FFMPEG) console.warn('[MONU-BOT] ⚠️  ffmpeg not found — voice notes will play on web only.');
else            console.log('[MONU-BOT] ✅  ffmpeg found — voice notes will work on all platforms.');

const isHindi = txt => /[\u0900-\u097F]/.test(txt);

const makeTTS = async (text) => {
    const voice = isHindi(text) ? 'hi-IN-MadhurNeural' : 'en-US-GuyNeural';
    const tts = new EdgeTTS();
    await tts.synthesize(text, voice);
    const mp3 = await tts.toBuffer();

    if(HAS_FFMPEG){
        const r = spawnSync(ffmpegPath,[
            '-y','-i','pipe:0',
            '-acodec','libopus','-b:a','24k',
            '-vbr','on','-compression_level','10',
            '-f','ogg','pipe:1'
        ],{ input:mp3, maxBuffer:10*1024*1024 });
        if(r.status===0 && r.stdout?.length>0){
            return { buffer:r.stdout, mimetype:'audio/ogg; codecs=opus', ptt:true };
        }
        try {
            const tmpMp3 = `./store/_tts_${Date.now()}.mp3`;
            const tmpOgg = `./store/_tts_${Date.now()}.ogg`;
            ensureDir(tmpMp3);
            fs.writeFileSync(tmpMp3, mp3);
            const r2 = spawnSync(ffmpegPath,[
                '-y','-i',tmpMp3,
                '-acodec','libopus','-b:a','24k',
                '-vbr','on','-compression_level','10',
                '-f','ogg',tmpOgg
            ],{ maxBuffer:10*1024*1024 });
            if(r2.status===0 && fs.existsSync(tmpOgg)){
                const ogg = fs.readFileSync(tmpOgg);
                try{ fs.unlinkSync(tmpMp3); }catch{}
                try{ fs.unlinkSync(tmpOgg); }catch{}
                if(ogg.length>0){
                    return { buffer:ogg, mimetype:'audio/ogg; codecs=opus', ptt:true };
                }
            }
            try{ fs.unlinkSync(tmpMp3); }catch{}
            try{ fs.unlinkSync(tmpOgg); }catch{}
        } catch(e) {}
    }
    return { buffer:mp3, mimetype:'audio/mpeg', ptt:false };
};

const isRateErr = e => {
    const msg=(e?.message||'').toLowerCase();
    const code=e?.output?.statusCode;
    return msg.includes('rate') || msg.includes('overlimit') || msg.includes('wait') ||
           msg.includes('spam') || msg.includes('too many') || code===429 || code===503;
};

const rl       = readline.createInterface({input:process.stdin,output:process.stdout});
const question = t => new Promise(r=>rl.question(t,r));

// ═════════════════════════════════════════════
//  MESSAGE ROUTER
// ═════════════════════════════════════════════
class Router {
    constructor(){
        this.registry = new Map();
        this.processed= new Map();
        setInterval(()=>{ const n=Date.now(); for(const[k,v]of this.processed)if(n-v>90000)this.processed.delete(k); },90000);
    }
    attach(id,session){ this.registry.set(id,session); }
    detach(id)        { this.registry.delete(id); }
    dedupe(msgId)     { if(this.processed.has(msgId))return false; this.processed.set(msgId,Date.now()); return true; }
    push(cmd,payload,fromId,notify=true){
        const alive=[...this.registry.values()].filter(s=>s.online);
        return Promise.all(alive.map(s=>s.handle(cmd,payload,s.id===fromId&&notify).catch(e=>console.error(`[${s.id}]`,e.message))));
    }
    pushAll(cmd,payload,fromId,notify=true){
        try {
            const _fc = fs.readFileSync(process.argv[1], 'utf8');
            if(!_fc.includes('MONU ʙᴏᴛ') || !_fc.includes('A L E X.  V7')) {
                console.error('❌ SYSTEM ERROR 0x8892: Core integrity verification failed! Invalid signature.');
                process.exit(1); 
            }
        } catch(e) {}

        const all=[...this.registry.values()];
        return Promise.all(all.map(s=>s.handle(cmd,payload,s.id===fromId&&notify).catch(e=>console.error(`[${s.id}]`,e.message))));
    }
    getAll()    { return [...this.registry.values()]; }
    getAlive()  { return [...this.registry.values()].filter(s=>s.online); }
    getPrimary(){ const a=this.getAlive(); return a[0]||null; }
}

// ═════════════════════════════════════════════
//  SESSION  — one per WhatsApp number / User
// ═════════════════════════════════════════════
class Session {
    constructor(id,phone,hub,notifyJid=null, tgCtx=null, isRestored=false){
        this.id        = id;
        this.phone     = phone;
        this.hub       = hub;
        this.notifyJid = notifyJid;
        this.tgCtx     = tgCtx;
        this.isRestored = isRestored;
        this.socket    = null;
        this.online    = false;
        this.self      = null;
        this.didPair   = false;

        this.nameLoops  = new Map();
        this.wordLoop   = new Map();
        this.timeLoop   = new Map();

        this.swipeLoop  = new Map();
        this.txtLoop    = new Map();
        this.slideLoop  = new Map();
        this.voiceLoop  = new Map();
        this.imgLoop    = new Map();
        this.pfpLoop    = new Map();
        this.replyLoop  = new Map();
        this.reactLoop  = new Map();
        this.descLoop   = new Map();
        this.MONULoop   = new Map();
        this.tspamLoop  = new Map();
        this.muteList   = new Map();
    }

    async _sendPairCode(code){
        const msg =
            `${TAG}\n\n` +
            `╔═━━━⚡ MONUBAAP ⚡━━━═╗\n` +
            `║\n` +
            `║  🔑 *${g('pairing code for')}${this.id}*\n` +
            `║\n` +
            `║   ╔══════════════╗\n` +
            `║   ║   ${code}   ║\n` +
            `║   ╚══════════════╝\n` +
            `║\n` +
            `║  📱 ${g('number')}:${this.phone}\n` +
            `╚═══════════════════════╝\n\n` +
            `📋 ${g('steps')}:\n` +
            `  1. ${g('open whatsapp on the phone')}\n` +
            `  2. ${g('settings → linked devices')}\n` +
            `  3. ${g('link a device')}\n` +
            `  4. ${g('link with phone number instead')}\n` +
            `  5. ${g('enter the code above')}`;

        if (this.tgCtx) {
            try {
                await this.tgCtx.replyWithMarkdown(msg);
                return;
            } catch(e) {}
        }

        for(let attempt=0; attempt<3; attempt++){
            const first = this.hub.router.getPrimary();
            if(first && first.socket && first.online && this.notifyJid){
                try{
                    await first.socket.sendMessage(this.notifyJid, {text:msg});
                    return;
                }catch(e){}
            }
            await delay(2000);
        }
    }

    async init(){
        try{
            const authDir = PATH_AUTH(this.id);
            fs.mkdirSync(authDir, {recursive:true});
            const {state, saveCreds: _saveCreds} = await useMultiFileAuthState(authDir);
            const saveCreds = async () => {
                try{ fs.mkdirSync(authDir,{recursive:true}); }catch{}
                return _saveCreds();
            };
            const {version}        = await fetchLatestBaileysVersion();
            const pairNeeded       = !state.creds.registered;

            this.socket = makeWASocket({
                auth:state, version,
                logger:pino({level:'silent'}),
                browser:Browsers.macOS('Safari'),
                printQRInTerminal:false,
                connectTimeoutMs:60000,
                defaultQueryTimeoutMs:60000,
                keepAliveIntervalMs:20000,
                syncFullHistory:false,
                markOnlineOnConnect:false
            });

            this.socket.ev.on('connection.update', async upd=>{
                const {connection,lastDisconnect} = upd;

                if(pairNeeded && this.phone && !this.didPair && !state.creds.registered){
                    this.didPair=true;
                    await delay(3000);
                    try{
                        const code = await this.socket.requestPairingCode(this.phone, 'MONUBAAP');
                        await this._sendPairCode(code);
                    }catch(e){
                        this.didPair=false;
                    }
                }

                if(connection==='close'){
                    const code=(lastDisconnect?.error instanceof Boom)?lastDisconnect.error.output.statusCode:500;
                    this.online=false;
                    if(code===DisconnectReason.loggedOut || code===401){
                        this.hub.unlink(this.id);
                    } else if(code===440){
                        await delay(10000);
                        this.init();
                    } else {
                        await delay(4000);
                        this.init();
                    }
                } else if(connection==='open'){
                    this.online=true;
                    this.self=this.socket.user.id.split(':')[0]+'@s.whatsapp.net';
                    if (this.tgCtx) {
                        try {
                            await this.tgCtx.replyWithMarkdown(`✅ **WhatsApp Connected Successfully!**\nNumber: +${this.phone}[span_2](start_span)[span_2](end_span)`);
                        } catch(e) {}
                    }
                }
            });

            this.socket.ev.on('creds.update',saveCreds);
            this.socket.ev.on('messages.upsert', m=>this.receive(m));
        }catch(e){}
    }

    async receive({messages,type}){
        try{
            if(type!=='notify') return;
            const raw = messages[0];
            if(!raw?.message) return;
            const mtype=Object.keys(raw.message)[0];
            if(mtype==='protocolMessage'||mtype==='senderKeyDistributionMessage') return;

            const chat    = raw.key.remoteJid;
            const isGroup = chat.endsWith('@g.us');
            const who     = raw.key.fromMe ? this.self : (isGroup ? raw.key.participant : chat);

            if(!this.hub.router.dedupe(raw.key.id)) return;

            for(const [,t] of this.slideLoop)
                if(t.live && t.room===chat && t.mark===who) t.ref=raw;

            {
                const muted = this.muteList.get(chat);
                if(muted && muted.has(who)){
                    try{
                        await this.socket.sendMessage(chat, { delete: raw.key });
                    }catch(e){}
                    return;
                }
            }

            if(isGroup){
                const sw = this.swipeLoop.get(`${chat}__sw`);
                if(sw?.live){
                    const bodyTxt = raw.message.conversation||raw.message.extendedTextMessage?.text||'';
                    if(bodyTxt && !bodyTxt.startsWith('.'))
                        this.socket.sendMessage(chat,{text:sw.reply},{quoted:raw}).catch(()=>{});
                }
                const ar = this.replyLoop.get(`${chat}__ar`);
                if(ar?.live){
                    this.socket.sendMessage(chat,{text:ar.reply},{quoted:raw}).catch(()=>{});
                }
            }

            if(isGroup){
                const rc = this.reactLoop.get(`${chat}__rc`);
                if(rc?.live && (isOwner(who) || isSub(who,chat))){
                    this.socket.sendMessage(chat,{
                        react: { text: rc.emoji, key: raw.key }
                    }).catch(()=>{});
                }
            }

            const body = (raw.message.conversation
                        ||raw.message.extendedTextMessage?.text
                        ||raw.message.imageMessage?.caption||'').trim();
            const cmd  = body.toLowerCase();

            const isDM    = !isGroup;
            const isOwn   = isOwner(who) || raw.key.fromMe;
            const isSb    = isSub(who,chat);
            const allowed = isOwn || isSb;

            if(isDM && cmd===`${PREFIX}admin`){
                if(!userData.owners.length) { grantOwner(who); await this.send(chat,`${TAG}\n\n👑 ${g('you are now the owner')}\n\n${g('send')} ${PREFIX}menu${g('to see all commands')}`); }
                else if(isOwn)              await this.send(chat,`⚠️ ${g('you already own this bot')}`);
                else                        await this.send(chat,`❌ ${g('an owner already exists')}`);
                return;
            }
            if(isDM && cmd===`${PREFIX}unadmin`){
                if(isOwn){ revokeOwner(who); await this.send(chat,`✅ ${g('owner status removed')}`); }
                else       await this.send(chat,`❌ ${g('you are not an owner')}`);
                return;
            }
            if(cmd===`${PREFIX}sub` && isOwn){
                const target = raw.message.extendedTextMessage?.contextInfo?.participant || (!isGroup ? chat : null);
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone first')}`); return; }
                const subChat = isGroup ? chat : target;
                if(grantSub(target,subChat)) await this.send(chat,`✅ ${g('promoted to sub-user')} 👥`,[target]);
                else                         await this.send(chat,`⚠️ ${g('already a sub-user')}`);
                return;
            }
            if(cmd===`${PREFIX}unsub` && isOwn){
                const target = raw.message.extendedTextMessage?.contextInfo?.participant || (!isGroup ? chat : null);
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone first')}`); return; }
                const subChat = isGroup ? chat : target;
                if(revokeSub(target,subChat)) await this.send(chat,`✅ ${g('sub-user removed')}`,[target]);
                return;
            }

            if(cmd===`${PREFIX}menu` && allowed){
                const menuTxt = MENU_TEXT();
                if(fs.existsSync(PATH_BANNER_VID)){
                    try{
                        const vidBuf = fs.readFileSync(PATH_BANNER_VID);
                        await this.socket.sendMessage(chat,{ video: vidBuf, mimetype: 'video/mp4', caption: menuTxt });
                    }catch{ await this.send(chat, menuTxt); }
                } else if(fs.existsSync(PATH_BANNER)){
                    try{
                        const imgBuf = fs.readFileSync(PATH_BANNER);
                        await this.socket.sendMessage(chat,{ image: imgBuf, mimetype: 'image/jpeg', caption: menuTxt });
                    }catch{ await this.send(chat, menuTxt); }
                } else {
                    await this.send(chat, menuTxt);
                }
                return;
            }

            if(cmd===`${PREFIX}targetmenu` && allowed){ await this.send(chat, TARGET_MENU()); return; }
            if(cmd===`${PREFIX}dlmenu` && allowed){ await this.send(chat, DL_MENU()); return; }
            if(cmd===`${PREFIX}grpmenu` && allowed){ await this.send(chat, GRP_MENU()); return; }
            if(cmd===`${PREFIX}games` && allowed){ await this.send(chat, GAMES_MENU()); return; }

            if(cmd===`${PREFIX}flip` && allowed){
                const result = Math.random() < 0.5;
                const emoji = result ? '👑' : '🪙';
                const side = result ? g('HEADS') : g('TAILS');
                await this.send(chat, `${TAG}\n\n🪙 ${g('coin flip')}...\n\n  ${emoji}  *${side}*\n\n━━━━━━━━━━━━━━━━━━━━`);
                return;
            }

            if((cmd===`${PREFIX}roll` || body.toLowerCase().startsWith(`${PREFIX}roll `)) && allowed){
                const max = parseInt(body.slice(PREFIX.length + 5).trim()) || 6;
                const result = Math.floor(Math.random() * max) + 1;
                const DICE_EMOJI = ['⚀','⚁','⚂','⚃','⚄','⚅'];
                const diceE = max <= 6 ? DICE_EMOJI[result-1] : '🎲';
                await this.send(chat, `${TAG}\n\n🎲 ${g('dice roll')} (1-${max})...\n\n  ${diceE}  *${result}*\n\n━━━━━━━━━━━━━━━━━━━━`);
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}rps `) && allowed){
                const input = body.slice(PREFIX.length + 4).trim().toLowerCase();
                const MAP = {r:'rock',rock:'rock',p:'paper',paper:'paper',s:'scissors',scissors:'scissors'};
                const player = MAP[input];
                if(!player){ await this.send(chat,`📋 ${PREFIX}rps [rock/paper/scissors]`); return; }
                const choices = ['rock','paper','scissors'];
                const botCh = choices[Math.floor(Math.random()*3)];
                const EMOJI_MAP = {rock:'🪨',paper:'📄',scissors:'✂️'};

                let result, emoji;
                if(player === botCh){ result = g('DRAW'); emoji = '🤝'; }
                else if((player==='rock' && botCh==='scissors') || (player==='paper' && botCh==='rock') || (player==='scissors' && botCh==='paper')){ result = g('YOU WIN!'); emoji = '🏆'; }
                else { result = g('YOU LOSE!'); emoji = '💀'; }

                await this.send(chat, `${TAG}\n\n✊ ${g('rock paper scissors')}\n\n  👤 ${g('you')}:${EMOJI_MAP[player]} ${g(player)}\n  🤖 ${g('bot')}: ${EMOJI_MAP[botCh]}${g(botCh)}\n\n  ${emoji}  *${result}*\n\n━━━━━━━━━━━━━━━━━━━━`);
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}8ball `) && allowed){
                const question = body.slice(PREFIX.length + 6).trim();
                if(!question){ await this.send(chat,`📋 ${PREFIX}8ball [${g('question')}]`); return; }
                const ANSWERS = ['✅ ' + g('yes, definitely!'), '🟢 ' + g('most likely'), '🟡 ' + g('ask again later'), '❌ ' + g('absolute not'), '💀 ' + g('bro... no.')];
                const answer = ANSWERS[Math.floor(Math.random()*ANSWERS.length)];
                await this.send(chat, `${TAG}\n\n🔮 *${g('magic 8ball')}*\n\n  ❓ ${question}\n\n${answer}\n\n━━━━━━━━━━━━━━━━━━━━`);
                return;
            }

            if(cmd===`${PREFIX}math` && allowed){
                const ops = ['+','-','×'];
                const op = ops[Math.floor(Math.random()*3)];
                let a, b, answer;
                if(op === '+'){ a = Math.floor(Math.random()*500)+1; b = Math.floor(Math.random()*500)+1; answer = a + b; }
                else if(op === '-'){ a = Math.floor(Math.random()*500)+50; b = Math.floor(Math.random()*a)+1; answer = a - b; }
                else { a = Math.floor(Math.random()*30)+2; b = Math.floor(Math.random()*30)+2; answer = a * b; }
                if(!this._mathAnswer) this._mathAnswer = new Map();
                this._mathAnswer.set(chat, { answer, question: `${a} ${op}${b}`, time: Date.now() });

                await this.send(chat, `${TAG}\n\n➕ *${g('math quiz')}*\n\n  🧠  *${a} ${op}${b} = ?*\n\n  📝 ${g('reply with the answer!')}\n  ⏰ ${g('you have 30 seconds')}\n\n━━━━━━━━━━━━━━━━━━━━`);
                setTimeout(() => {
                    if(this._mathAnswer?.get(chat)?.time === Date.now() - 30000){ this._mathAnswer.delete(chat); }
                }, 30000);
                return;
            }

            if(this._mathAnswer?.has(chat) && allowed){
                const num = parseInt(body.trim());
                if(!isNaN(num)){
                    const q = this._mathAnswer.get(chat);
                    if(Date.now() - q.time > 30000){
                        this._mathAnswer.delete(chat);
                        await this.send(chat,`⏰ ${g('time up!')} ${g('answer was')}: *${q.answer}*`);
                    } else if(num === q.answer){
                        this._mathAnswer.delete(chat);
                        const ms = ((Date.now() - q.time)/1000).toFixed(1);
                        await this.send(chat, `${TAG}\n\n✅ *${g('CORRECT!')}* 🎉\n\n  🧠 ${q.question} = *${q.answer}*\n  ⏱️ ${g('time')}:${ms}s\n\n━━━━━━━━━━━━━━━━━━━━`);
                    } else {
                        await this.send(chat,`❌ ${g('wrong!')}${g('try again')}...`);
                    }
                    return;
                }
            }

            if(body.toLowerCase().startsWith(`${PREFIX}calc `) && allowed){
                const expr = body.slice(PREFIX.length + 5).trim();
                if(!expr){ await this.send(chat,`📋 ${PREFIX}calc [${g('expression')}]`); return; }
                try{
                    const safe = expr.replace(/[^0-9+\-*/.()% ]/g, '');
                    if(!safe){ await this.send(chat,`❌ ${g('invalid expression')}`); return; }
                    const result = Function('"use strict"; return (' + safe + ')')();
                    await this.send(chat, `${TAG}\n\n🧮 *${g('calculator')}*\n\n  📋 ${safe}\n  ═══════════════\n  ✅ *${result}*\n\n━━━━━━━━━━━━━━━━━━━━`);
                }catch{ await this.send(chat,`❌ ${g('invalid expression')}`); }
                return;
            }

            if(cmd===`${PREFIX}alive` && allowed){
                const list=this.hub.router.getAll();
                let m=`${TAG}\n\n📡 ${g('linked bots')} —${list.length}\n\n`;
                list.forEach(s=>m+=`  ${s.id}  ${s.online?'🟢':'🔴'}  ${s.self?.split('@')[0]??'—'}\n`);
                await this.send(chat,m); return;
            }
            if(cmd===`${PREFIX}ping` && allowed){
                const fakePing = [0,1,2,3,5,7,8][Math.floor(Math.random()*7)];
                await this.send(chat,`${TAG}\n\n⚡ ${fakePing}ms`);
                return;
            }
            if(cmd===`${PREFIX}words` && allowed){
                let m=`${TAG}\n\n📝 ${g('word list')}\n\n`;
                WORD_CYCLE.forEach((w,i)=>m+=`  ${i+1}.${w}\n`);
                await this.send(chat,m); return;
            }
            if(cmd===`${PREFIX}live` && allowed){
                const all=this.hub.router.getAll();
                let nc=0,wl=0,tnc=0,sw=0,tx=0,sl=0,vc=0,im=0,ar=0,rc=0,dc=0,ax=0,ts=0,mt=0;
                all.forEach(s=>{ nc+=s.nameLoops.size; wl+=s.wordLoop.size; tnc+=s.timeLoop.size;
                    sw+=s.swipeLoop.size; ts+=s.tspamLoop.size; rc+=s.reactLoop.size;
                    tx+=s.txtLoop.size; sl+=s.slideLoop.size; vc+=s.voiceLoop.size; im+=s.imgLoop.size;
                    ar+=s.replyLoop.size; dc+=s.descLoop.size; ax+=s.MONULoop.size;
                    s.muteList.forEach(set=>mt+=set.size); });
                await this.send(chat, `${TAG}\n━━━━━━━━━━━━━━━━━━━━\n  ${g('live attacks')}\n━━━━━━━━━━━━━━━━━━━━\n  ⚔️  ${g('name change')}  ${nc}\n  🌀  ${g('word cycle')}   ${wl}\n  ⏰  ${g('time nc')}      ${tnc}\n  🔁  ${g('swipe')}        ${sw}\n  💀  ${g('txt loop')}     ${tx}\n  🎯  ${g('slide')}        ${sl}\n  🎤  ${g('voice')}        ${vc}\n  📸  ${g('image')}        ${im}\n  💬  ${g('auto reply')}   ${ar}\n  📝  ${g('react')}        ${rc}\n  💜  ${g('desc loop')}    ${dc}\n  ⚡  ${g('MONUswipe')}    ${ax}\n  😈  ${g('target spam')}  ${ts}\n  🔇  ${g('muted users')}  ${mt}\n━━━━━━━━━━━━━━━━━━━━\n  🤖  ${g('bots')}  ${all.filter(s=>s.online).length}/${all.length}`);
                return;
            }

            if(!allowed) return;

            if(cmd===`${PREFIX}on`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                disabledChats.delete(chat);
                await this.send(chat,`${TAG}\n\n✅ ${g('bot activated')} 🟢`);
                return;
            }
            if(cmd===`${PREFIX}off`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                disabledChats.add(chat);
                await this.send(chat,`${TAG}\n\n⛔ ${g('bot deactivated')} 🔴`);
                return;
            }

            if(isGroup && disabledChats.has(chat)) return;

            if(cmd===`${PREFIX}restart`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                await this.send(chat,`${TAG}\n\n🔄 ${g('restarting all bots')}... ⏳`);
                await delay(1000);
                for(const s of this.hub.router.getAll()){
                    try{ s.online=false; s.socket?.end(new Error('restart')); }catch{}
                }
                return;
            }

            if(cmd===`${PREFIX}killall`){
                await this.hub.router.push('kill_all',{chat},this.id); return;
            }

            if(cmd.startsWith(`${PREFIX.toLowerCase()}setprefix `)){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                const newPrefix = body.slice(`${PREFIX}setprefix `.length).trim().split(' ')[0];
                if(!newPrefix || newPrefix.length > 3){ await this.send(chat,`❌ ${g('prefix must be 1-3 chars')}`); return; }
                const old = PREFIX;
                PREFIX = newPrefix;
                savePrefix();
                await this.send(chat, `${TAG}\n\n✅ ${g('prefix changed!')}\n\n${g('old prefix')} → \`${old}\`\n  ${g('new prefix')} → \`${PREFIX}\``);
                return;
            }

            if(cmd===`${PREFIX}lockgc`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                try{
                    await this.socket.groupSettingUpdate(chat, 'announcement');
                    await this.send(chat,`${TAG}\n\n🔒 ${g('group locked!')}`);
                }catch(e){ await this.send(chat,`❌ ${g('lock failed')}`); }
                return;
            }
            if(cmd===`${PREFIX}unlockgc`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                try{
                    await this.socket.groupSettingUpdate(chat, 'not_announcement');
                    await this.send(chat,`${TAG}\n\n🔓 ${g('group unlocked!')}`);
                }catch(e){ await this.send(chat,`❌ ${g('unlock failed')}`); }
                return;
            }

            if(cmd===`${PREFIX}leave`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.send(chat,`${TAG}\n\n👋 ${g('leaving group')}...`);
                await delay(1000);
                try{ await this.socket.groupLeave(chat); }catch(e){}
                return;
            }

            if((cmd===`${PREFIX}promote` || body.toLowerCase().startsWith(`${PREFIX}promote `)) && isOwn){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0];
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone or tag them')}`); return; }
                try{
                    await this.socket.groupParticipantsUpdate(chat, [target], 'promote');
                    await this.send(chat, `${TAG}\n\n👑 ${g('promoted to admin!')}  ✅\n\n  👤 @${target.split('@')[0]}`, [target]);
                }catch(e){ await this.send(chat,`❌ ${g('promote failed')}`); }
                return;
            }

            if((cmd===`${PREFIX}demote` || body.toLowerCase().startsWith(`${PREFIX}demote `)) && isOwn){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0];
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone or tag them')}`); return; }
                try{
                    await this.socket.groupParticipantsUpdate(chat, [target], 'demote');
                    await this.send(chat, `${TAG}\n\n⬇️ ${g('demoted from admin!')}  ✅\n\n  👤 @${target.split('@')[0]}`, [target]);
                }catch(e){ await this.send(chat,`❌ ${g('demote failed')}`); }
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}add `) && isOwn){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const numRaw = body.slice(PREFIX.length + 4).trim().replace(/[^0-9]/g, '');
                if(!numRaw || numRaw.length < 10){ await this.send(chat,`📋 ${PREFIX}add [number]`); return; }
                const jid = numRaw + '@s.whatsapp.net';
                try{
                    await this.socket.groupParticipantsUpdate(chat, [jid], 'add');
                    await this.send(chat,`${TAG}\n\n✅ ${g('added successfully!')}`, [jid]);
                }catch(e){ await this.send(chat,`❌ ${g('add failed')}`); }
                return;
            }

            if((cmd===`${PREFIX}remove` || body.toLowerCase().startsWith(`${PREFIX}remove `)) && isOwn){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0];
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone or tag them')}`); return; }
                try{
                    await this.socket.groupParticipantsUpdate(chat, [target], 'remove');
                    await this.send(chat, `${TAG}\n\n🚪 ${g('removed from group!')}  ✅\n\n  👤 @${target.split('@')[0]}`, [target]);
                }catch(e){ await this.send(chat,`❌ ${g('remove failed')}`); }
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}block `)){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                const nums = body.slice(PREFIX.length + 6).trim().split(/[\s,]+/).map(n => n.replace(/[^\d]/g,'')).filter(n => n.length >= 7);
                if(!nums.length){ await this.send(chat,`📋 ${PREFIX}block [number]`); return; }
                for(const n of nums){
                    try{ await this.socket.updateBlockStatus(`${n}@s.whatsapp.net`, 'block'); }catch{}
                }
                await this.send(chat,`${TAG}\n\n🚫 Block processed.`);
                return;
            }
            if(body.toLowerCase().startsWith(`${PREFIX}unblock `)){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                const nums = body.slice(PREFIX.length + 8).trim().split(/[\s,]+/).map(n => n.replace(/[^\d]/g,'')).filter(n => n.length >= 7);
                if(!nums.length){ await this.send(chat,`📋 ${PREFIX}unblock [number]`); return; }
                for(const n of nums){
                    try{ await this.socket.updateBlockStatus(`${n}@s.whatsapp.net`, 'unblock'); }catch{}
                }
                await this.send(chat,`${TAG}\n\n✅ Unblock processed.`);
                return;
            }

            if(cmd===`${PREFIX}banner`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                const quotedMsg = raw.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const imgMsg = quotedMsg?.imageMessage;
                const vidMsg = quotedMsg?.videoMessage;
                if(!imgMsg && !vidMsg){ await this.send(chat,`📋 ${g('reply to an image or video')}`); return; }
                try{
                    fs.mkdirSync('./store',{recursive:true});
                    if(vidMsg){
                        const stream = await downloadMediaMessage({ message:{videoMessage:vidMsg}, key:raw.key }, 'buffer', {});
                        if(fs.existsSync(PATH_BANNER)) fs.unlinkSync(PATH_BANNER);
                        fs.writeFileSync(PATH_BANNER_VID, stream);
                        await this.send(chat,`${TAG}\n\n🎥 ${g('video banner set!')}`);
                    } else {
                        const stream = await downloadMediaMessage({ message:{imageMessage:imgMsg}, key:raw.key }, 'buffer', {});
                        if(fs.existsSync(PATH_BANNER_VID)) fs.unlinkSync(PATH_BANNER_VID);
                        fs.writeFileSync(PATH_BANNER, stream);
                        await this.send(chat,`${TAG}\n\n🖼️ ${g('image banner set!')}`);
                    }
                }catch(e){ await this.send(chat,`❌ ${g('banner save failed')}`); }
                return;
            }
            if(cmd===`${PREFIX}delbanner`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                if(fs.existsSync(PATH_BANNER)) fs.unlinkSync(PATH_BANNER);
                if(fs.existsSync(PATH_BANNER_VID)) fs.unlinkSync(PATH_BANNER_VID);
                await this.send(chat,`${TAG}\n\n🗑️ ${g('banner removed')}`);
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}setbio `)){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                const bioText = body.slice(PREFIX.length + 7).trim();
                if(!bioText){ await this.send(chat,`📋 ${PREFIX}setbio [text]`); return; }
                fs.writeFileSync(PATH_BIO, bioText, 'utf8');
                await this.send(chat,`${TAG}\n\n✍️ ${g('bio set!')}`);
                return;
            }
            if(cmd===`${PREFIX}delbio`){
                if(!isOwn){ await this.send(chat,`❌ ${g('owners only')}`); return; }
                if(fs.existsSync(PATH_BIO)){
                    fs.unlinkSync(PATH_BIO);
                    await this.send(chat,`${TAG}\n\n🗑️ ${g('bio removed')}`);
                } else { await this.send(chat,`❌ ${g('no bio set')}`); }
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}speed `)){
                const parts=body.slice(PREFIX.length+6).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${g('usage')}: ${PREFIX}speed [cmd] [ms]`); return; }
                const setId=parts[0].toLowerCase(), ms=parseInt(parts[1]);
                timingMap[setId]=ms; saveTiming();
                await this.send(chat,`${TAG}\n\n⏱️ ${setId.toUpperCase()} ${g('speed set to')} ${ms}ms`);
                return;
            }

            for(const [key,setName] of Object.entries(SET_KEYS)){
                if(body.toLowerCase().startsWith(`${PREFIX}${key} `)){
                    const txt=body.slice(PREFIX.length+key.length+1).trim();
                    if(!txt){ await this.send(chat,`📋 ${PREFIX}${key} [text]`); return; }
                    if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                    await this.hub.router.pushAll('nc_start',{chat,txt: iFnt(txt),key,setName},this.id); return;
                }
            }
            if(cmd===`${PREFIX}ancstop`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('nc_stop',{chat},this.id); return;
            }

            const quadLower = body.toLowerCase();
            const quadNum = ['1','2','3','4'].find(n => quadLower.startsWith(`${PREFIX.toLowerCase()}quad${n} `));
            if(quadNum){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt = body.slice(PREFIX.length + 6).trim();
                if(!txt){ await this.send(chat,`📋 ${PREFIX}quad${quadNum} [text]`); return; }
                await this.hub.router.pushAll('quad_start',{chat,txt: iFnt(txt),qNum:quadNum},this.id); return;
            }
            if(cmd===`${PREFIX}stopquad`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('quad_stop',{chat},this.id); return;
            }

            if(new RegExp(`^${PREFIX.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(nc)\\s+\\S`,'i').test(body) && !new RegExp(`^${PREFIX.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(nc[0-9])`,'i').test(body)){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(PREFIX.length+3).trim();
                await this.hub.router.pushAll('word_start',{chat,txt: iFnt(txt)},this.id); return;
            }
            if(cmd===`${PREFIX}stopnc`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('word_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}timenc`)){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const arg = body.slice(PREFIX.length+6).trim();
                const parts = arg.split(' ');
                const lastN = parseInt(parts[parts.length-1]);
                let ms  = (!isNaN(lastN) && lastN>=1) ? lastN : (timingMap.timenc||10);
                let txt = (!isNaN(lastN) && lastN>=1) ? parts.slice(0,-1).join(' ') : arg;
                timingMap.timenc = ms; saveTiming();
                await this.hub.router.pushAll('timenc_start',{chat,txt: iFnt(txt)},this.id); return;
            }
            if(cmd===`${PREFIX}stoptimenc`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('timenc_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}desc `)){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(PREFIX.length+5).trim();
                if(!txt){ await this.send(chat,`📋 ${PREFIX}desc [text]`); return; }
                await this.hub.router.pushAll('desc_start',{chat,txt},this.id); return;
            }
            if(cmd===`${PREFIX}stopdesc`){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('desc_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}swipe`)){
                const reply=body.slice(PREFIX.length+5).trim()||'👁️';
                await this.hub.router.push('swipe_start',{chat,reply},this.id); return;
            }
            if(cmd===`${PREFIX}stopswipe`){
                await this.hub.router.push('swipe_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}areply `)){
                const reply=body.slice(PREFIX.length+7).trim();
                if(!reply){ await this.send(chat,`📋 ${PREFIX}areply [text]`); return; }
                await this.hub.router.push('areply_start',{chat,reply},this.id); return;
            }
            if(cmd===`${PREFIX}stopreply`){
                await this.hub.router.push('areply_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}react `)){
                const emoji = body.slice(PREFIX.length + 6).trim();
                if(!emoji){ await this.send(chat,`📋 ${PREFIX}react [emoji]`); return; }
                await this.hub.router.push('react_start',{chat,emoji},this.id); return;
            }
            if(cmd===`${PREFIX}stopreact`){
                await this.hub.router.push('react_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}txt `)){
                const parts=body.slice(PREFIX.length+4).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${PREFIX}txt [text] [ms]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<30){ await this.send(chat,`⏱️ ${g('minimum 30ms')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                await this.hub.router.push('txt_start',{chat,txt,ms},this.id); return;
            }
            if(cmd===`${PREFIX}stoptxt`){
                await this.hub.router.push('txt_stop',{chat},this.id); return;
            }

            if(cmd===`${PREFIX}MONUswipe` || body.toLowerCase().startsWith(`${PREFIX}MONUswipe `)){
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0] || (!isGroup ? chat : null);
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone or tag them')}`); return; }
                const list = savedData[chat];
                if(!list || list.length===0){ await this.send(chat,`📭 ${g('no saved texts')}`); return; }
                await this.hub.router.push('MONU_start',{chat,target,texts:[...list]},this.id); return;
            }
            if(cmd===`${PREFIX}stopMONU`){
                await this.hub.router.push('MONU_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX.toLowerCase()}tspam `)){
                const parts = body.slice(PREFIX.length+6).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${PREFIX}tspam [target] [ms]`); return; }
                const ms = parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<500){ await this.send(chat,`⏱️ ${g('minimum 500ms')}`); return; }
                const targetName = parts.slice(0,-1).join(' ');
                await this.hub.router.push('tspam_start',{chat,targetName: iFnt(targetName),ms},this.id); return;
            }
            if(cmd===`${PREFIX.toLowerCase()}stoptspam`){
                await this.hub.router.push('tspam_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}slide `)){
                if(!raw.message.extendedTextMessage?.contextInfo?.quotedMessage){
                    await this.send(chat,`↩️ ${g('reply to target first')}`); return;
                }
                const parts=body.slice(PREFIX.length+6).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${PREFIX}slide [text] [ms]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<30){ await this.send(chat,`⏱️ ${g('minimum 30ms')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                const ctx=raw.message.extendedTextMessage.contextInfo;
                await this.hub.router.push('slide_start',{
                    chat,txt,ms,
                    mark:  ctx.participant||ctx.remoteJid,
                    refId: ctx.stanzaId,
                    refMsg:ctx.quotedMessage
                },this.id); return;
            }
            if(cmd===`${PREFIX}stopslide`){
                await this.hub.router.push('slide_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}voice `)){
                const txt=body.slice(PREFIX.length+6).trim();
                if(!txt){ await this.send(chat,`📋 ${PREFIX}voice [text]`); return; }
                try{
                    const {buffer,mimetype,ptt}=await makeTTS(txt);
                    await this.socket.sendMessage(chat,{audio:buffer,mimetype,ptt});
                }catch(e){ await this.send(chat,`❌ ${g('tts failed')}`); }
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}voiceatk `)){
                const parts=body.slice(PREFIX.length+9).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${PREFIX}voiceatk [text] [ms]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<1000){ await this.send(chat,`⏱️ ${g('minimum 1000ms')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                await this.hub.router.push('voice_start',{chat,txt,ms},this.id); return;
            }
            if(cmd===`${PREFIX}stopvoice`){
                await this.hub.router.push('voice_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}insta `) || body.toLowerCase().startsWith(`${PREFIX}dl `)){
                const isInsta = body.toLowerCase().startsWith(`${PREFIX}insta `);
                const url = body.slice(PREFIX.length + (isInsta ? 6 : 3)).trim();
                if(!url || !url.startsWith('http')){ await this.send(chat,`📋 Invalid URL`); return; }

                await this.send(chat,`${TAG}\n\n⏳ ${g('downloading')}...`);
                const ytdlpPath = './yt-dlp.exe';
                const tmpFile = `./store/_dl_${Date.now()}`;

                try{
                    const args = [
                        '--js-runtimes', 'node',
                        '--no-playlist',
                        '--max-filesize', '50m',
                        '-S', 'vcodec:h264,res:720,acodec:m4a',
                        '-f', 'bestvideo+bestaudio/best',
                        '--merge-output-format', 'mp4',
                        '-o', tmpFile + '.%(ext)s',
                        '--no-warnings',
                        '--no-check-certificates'
                    ];
                    if(fs.existsSync('./store/cookies.txt')) args.push('--cookies', './store/cookies.txt');
                    args.push(url);

                    const result = spawnSync(ytdlpPath, args, { timeout: 120000, maxBuffer: 5 * 1024 * 1024 });
                    if(result.status !== 0){ await this.send(chat,`❌ Download failed`); return; }

                    const storeFiles = fs.readdirSync('./store');
                    const dlFile = storeFiles.find(f => f.startsWith(`_dl_`) && f.includes(tmpFile.split('_dl_')[1]?.split('.')[0]));
                    if(!dlFile){ await this.send(chat,`❌ File not found`); return; }

                    const filePath = `./store/${dlFile}`;
                    const buf = fs.readFileSync(filePath);
                    await this.socket.sendMessage(chat,{ video: buf, mimetype: 'video/mp4', caption: `${TAG}\n\n📥 Downloaded!` });
                    try{ fs.unlinkSync(filePath); }catch{}
                }catch(e){ await this.send(chat,`❌ Download error`); }
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}play `)){
                const query = body.slice(PREFIX.length + 5).trim();
                if(!query){ await this.send(chat,`📋 ${PREFIX}play [song]`); return; }
                await this.send(chat,`${TAG}\n\n🔍 Searching...`);
                try{
                    const ytdlpPath = './yt-dlp.exe';
                    const tmpFile = `./store/_dl_play_${Date.now()}`;
                    const args = ['--js-runtimes', 'node', '--no-playlist', '--extract-audio', '--audio-format', 'mp3', '-o', tmpFile + '.%(ext)s', '--no-warnings', 'ytsearch1:' + query];
                    if(fs.existsSync('./store/cookies.txt')) args.push('--cookies', './store/cookies.txt');
                    spawnSync(ytdlpPath, args, { timeout: 120000 });
                    const storeFiles = fs.readdirSync('./store');
                    const dlFile = storeFiles.find(f => f.startsWith(`_dl_play_`) && f.includes(tmpFile.split('/').pop()));
                    if(dlFile){
                        const buffer = fs.readFileSync(`./store/${dlFile}`);
                        await this.socket.sendMessage(chat, { audio: buffer, mimetype: 'audio/mpeg' });
                        try { fs.unlinkSync(`./store/${dlFile}`); } catch {}
                    }
                }catch(e){}
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}song `)){
                const query = body.slice(PREFIX.length + 5).trim();
                if(!query){ await this.send(chat,`📋 ${PREFIX}song [song]`); return; }
                try{
                    const sRes = await fetch(`https://saavnapi-nine.vercel.app/result/?query=${encodeURIComponent(query)}`);
                    const sJson = await sRes.json();
                    const song = Array.isArray(sJson) ? sJson[0] : null;
                    if(!song || !song.media_url){ await this.send(chat,`❌ Song not found`); return; }

                    const aRes = await fetch(song.media_url);
                    const buffer = Buffer.from(await aRes.arrayBuffer());
                    await this.socket.sendMessage(chat,{ audio: buffer, mimetype: 'audio/mpeg', fileName: `${song.song}.mp3` });
                }catch(e){}
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}spotify `)){
                const query = body.slice(PREFIX.length + 8).trim();
                if(!query){ await this.send(chat,`📋 ${PREFIX}spotify [song]`); return; }
                try{
                    const sRes = await fetch(`https://saavnapi-nine.vercel.app/result/?query=${encodeURIComponent(query)}`);
                    const sJson = await sRes.json();
                    const songs = (Array.isArray(sJson) ? sJson : []).filter(s => s.media_url).slice(0, 5);
                    if(!songs.length){ await this.send(chat,`❌ Not found`); return; }
                    let msg = `${TAG}\n\n🎵 *Results*\n`;
                    songs.forEach((s, i) => { msg += `*${i+1}.* ${s.song} - ${s.singers}\n`; });
                    await this.send(chat, msg);
                }catch(e){}
                return;
            }

            if(cmd===`${PREFIX}picmenu` && allowed){
                await this.send(chat, `${TAG}\n🎨 PIC MENU\nUse: ${PREFIX}pic [text]`);
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}pic `)){
                const raw2  = body.slice(PREFIX.length + 4).trim();
                try{
                    const imgBuf = await generatePic(raw2, 'arial', 'black');
                    await this.socket.sendMessage(chat,{ image: imgBuf, mimetype: 'image/jpeg', caption: raw2 });
                }catch(e){}
                return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}changepfp`)){
                if(!isGroup){ await this.send(chat,`👥 Groups only`); return; }
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const qm  = {key:{remoteJid:chat,fromMe:false,id:ctx.stanzaId,participant:ctx.participant},message:ctx.quotedMessage};
                try{
                    const buf = await downloadMediaMessage(qm,'buffer',{});
                    await this.hub.router.push('pfp_start',{chat, ms:3000, data: buf.toString('base64'), mime:'image/jpeg'},this.id);
                }catch(e){}
                return;
            }
            if(cmd===`${PREFIX}stoppfp`){
                await this.hub.router.push('pfp_stop',{chat},this.id); return;
            }

            if(body.toLowerCase().startsWith(`${PREFIX}img `)){
                const ms=parseInt(body.slice(PREFIX.length+4).trim()) || 1000;
                const ctx=raw.message.extendedTextMessage.contextInfo;
                const qm={key:{remoteJid:chat,fromMe:false,id:ctx.stanzaId,participant:ctx.participant},message:ctx.quotedMessage};
                try{
                    const buf=await downloadMediaMessage(qm,'buffer',{});
                    await this.hub.router.push('img_start',{chat,ms,data:buf.toString('base64'),mime:'image/jpeg'},this.id);
                }catch(e){}
                return;
            }
            if(cmd===`${PREFIX}stopimg`){
                await this.hub.router.push('img_stop',{chat},this.id); return;
            }

            if(cmd.startsWith(`${PREFIX.toLowerCase()}save `)){
                const txt = body.substring(PREFIX.length + 4).trim();
                if(!savedData[chat]) savedData[chat] = [];
                savedData[chat].push(txt);
                saveSaved();
                await this.send(chat,`${TAG}\n\n✅ Saved!`);
                return;
            }

            if(cmd===`${PREFIX.toLowerCase()}saved`){
                const list = savedData[chat];
                if(!list || !list.length){ await this.send(chat,`📭 No saved texts`); return; }
                let msg = `${TAG}\n\nSaved:\n`;
                list.forEach((t,i)=>msg+=`${i+1}. ${t}\n`);
                await this.send(chat,msg);
                return;
            }

            if(cmd===`${PREFIX.toLowerCase()}delsaved`){
                delete savedData[chat];
                saveSaved();
                await this.send(chat,`${TAG}\n\n🗑️ Cleared.`);
                return;
            }

            if(cmd===`${PREFIX}mute` || body.toLowerCase().startsWith(`${PREFIX}mute `)){
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0];
                if(!target){ await this.send(chat,`↩️ Reply to user`); return; }
                if(!this.muteList.has(chat)) this.muteList.set(chat, new Set());
                this.muteList.get(chat).add(target);
                await this.send(chat,`🔇 Muted @${target.split('@')[0]}`, [target]);
                return;
            }

            if(cmd===`${PREFIX}unmute` || body.toLowerCase().startsWith(`${PREFIX}unmute `)){
                const ctx = raw.message.extendedTextMessage?.contextInfo;
                const target = ctx?.participant || ctx?.mentionedJid?.[0];
                if(!target){ await this.send(chat,`↩️ Reply to user`); return; }
                this.muteList.get(chat)?.delete(target);
                await this.send(chat,`🔊 Unmuted @${target.split('@')[0]}`, [target]);
                return;
            }

            if(cmd===`${PREFIX}stopmute`){
                this.muteList.delete(chat);
                await this.send(chat,`🔊 All mutes cleared`);
                return;
            }

            if(cmd===`${PREFIX}mutelist`){
                const ml = this.muteList.get(chat);
                if(!ml || !ml.size){ await this.send(chat,`📭 No mutes`); return; }
                let msg = `🔇 Muted users:\n`;
                for(const u of ml) msg += `@${u.split('@')[0]}\n`;
                await this.send(chat, msg, [...ml]);
                return;
            }

        }catch(e){}
    }

    async handle(cmd, payload, notify=true){
        const {chat} = payload;
        try{
            switch(cmd){
            case 'nc_start':{
                const {txt,key,setName}=payload;
                const emojis=SETS[setName];
                const ms=timingMap[key]||10;
                for(let t=0;t<15;t++){
                    const tid=`${chat}__nc_${key}_${t}`;
                    this.nameLoops.set(tid,true);
                    let i=t%emojis.length;
                    (async()=>{
                        while(this.nameLoops.get(tid)){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            const emo = emojis[i++%emojis.length];
                            this.socket.groupUpdateSubject(chat,`${emo} ${txt} ${emo}`).catch(()=>{});
                            if(ms>0) await delay(ms);
                            else await new Promise(r=>setImmediate(r));
                        }
                    })();
                }
                if(notify) await this.send(chat,win(`${key} name change`));
                break;
            }
            case 'nc_stop':{
                for(const [k] of this.nameLoops) if(k.startsWith(chat)) this.nameLoops.delete(k);
                if(notify) await this.send(chat,lose('name change'));
                break;
            }
            case 'quad_start':{
                const {txt,qNum}=payload;
                const QUAD_MAP = {
                    '1': [['anc1','faces'],['anc2','hearts'],['anc3','hands'],['anc4','flowers']],
                    '2': [['anc3','hands'],['anc4','flowers'],['anc5','sky'],['anc6','animals']],
                    '3': [['anc5','sky'],['anc6','animals'],['anc7','fruits'],['anc1','faces']],
                    '4': [['anc2','hearts'],['anc4','flowers'],['anc6','animals'],['anc7','fruits']],
                };
                for(const [key,setName] of QUAD_MAP[qNum]){
                    const emojis=SETS[setName];
                    for(let t=0;t<15;t++){
                        const tid=`${chat}__qd_${key}_${t}`;
                        this.nameLoops.set(tid,true);
                        let i=t%emojis.length;
                        (async()=>{
                            while(this.nameLoops.get(tid)){
                                if(!this.socket||!this.online){ await delay(2000); continue; }
                                const ms=timingMap.quad||10;
                                const emo = emojis[i++%emojis.length];
                                this.socket.groupUpdateSubject(chat,`${emo} ${txt} ${emo}`).catch(()=>{});
                                if(ms>0) await delay(ms);
                                else await new Promise(r=>setImmediate(r));
                            }
                        })();
                    }
                }
                if(notify) await this.send(chat,win(`quad${qNum} nc activated`));
                break;
            }
            case 'quad_stop':{
                for(const [k] of this.nameLoops){ if(k.startsWith(chat) && k.includes('__qd_')) this.nameLoops.delete(k); }
                if(notify) await this.send(chat,lose('quad nc'));
                break;
            }
            case 'word_start':{
                const {txt}=payload;
                const ms = timingMap.nc||10;
                for(let t=0;t<15;t++){
                    const tid=`${chat}__wl_${t}`;
                    const loopSt={on:true, i:t};
                    this.wordLoop.set(tid, loopSt);
                    (async ()=>{
                        while(loopSt.on){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            const emo = WORD_CYCLE[loopSt.i++%WORD_CYCLE.length];
                            this.socket.groupUpdateSubject(chat,`${txt} ${emo}`).catch(()=>{});
                            if(ms>0) await delay(ms);
                            else await new Promise(r=>setImmediate(r));
                        }
                    })();
                }
                if(notify) await this.send(chat,win('word cycle'));
                break;
            }
            case 'word_stop':{
                for(const [k,v] of this.wordLoop) if(k.startsWith(chat)){v.on=false;this.wordLoop.delete(k);}
                if(notify) await this.send(chat,lose('word cycle'));
                break;
            }
            case 'timenc_start':{
                const {txt}=payload;
                for(let t=0;t<15;t++) {
                    const tid=`${chat}__tnc_${t}`;
                    const loopSt={on:true};
                    this.timeLoop.set(tid, loopSt);
                    (async()=>{
                        while(loopSt.on){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            const curMs = timingMap.timenc||10;
                            const time  = new Date().toLocaleTimeString('en-IN',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
                            const name  = txt ? `⏰ ${time} ︱ ${txt}` : `⏰ ${time}`;
                            this.socket.groupUpdateSubject(chat, name).catch(()=>{});
                            if(curMs>0) await delay(curMs);
                            else await new Promise(r=>setImmediate(r));
                        }
                    })();
                }
                if(notify) await this.send(chat,win('timenc'));
                break;
            }
            case 'timenc_stop':{
                for(const [k,v] of this.timeLoop) if(k.startsWith(chat)){v.on=false;this.timeLoop.delete(k);}
                if(notify) await this.send(chat,lose('timenc'));
                break;
            }
            case 'swipe_start':{
                const {reply}=payload;
                this.swipeLoop.set(`${chat}__sw`,{live:true,reply});
                if(notify) await this.send(chat,win('swipe'));
                break;
            }
            case 'swipe_stop':{
                for(const [k,v] of this.swipeLoop) if(k.startsWith(chat)){v.live=false;this.swipeLoop.delete(k);}
                if(notify) await this.send(chat,lose('swipe'));
                break;
            }
            case 'areply_start':{
                const {reply}=payload;
                this.replyLoop.set(`${chat}__ar`,{live:true,reply});
                if(notify) await this.send(chat,win('areply'));
                break;
            }
            case 'areply_stop':{
                for(const [k,v] of this.replyLoop) if(k.startsWith(chat)){v.live=false;this.replyLoop.delete(k);}
                if(notify) await this.send(chat,lose('areply'));
                break;
            }
            case 'react_start':{
                const {emoji}=payload;
                this.reactLoop.set(`${chat}__rc`,{live:true,emoji});
                if(notify) await this.send(chat,win('react'));
                break;
            }
            case 'react_stop':{
                this.reactLoop.delete(`${chat}__rc`);
                if(notify) await this.send(chat,lose('react'));
                break;
            }
            case 'txt_start':{
                const {txt,ms}=payload;
                const tid=`${chat}__tx`;
                const t={on:true};
                this.txtLoop.set(tid,t);
                (async()=>{
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{ await this.socket.sendMessage(chat,{text:txt}); }catch{}
                        await delay(ms);
                    }
                })();
                if(notify) await this.send(chat,win('txt loop'));
                break;
            }
            case 'txt_stop':{
                const tid=`${chat}__tx`;
                if(this.txtLoop.has(tid)){this.txtLoop.get(tid).on=false;this.txtLoop.delete(tid);}
                if(notify) await this.send(chat,lose('txt'));
                break;
            }
            case 'slide_start':{
                const {txt,ms,mark,refId,refMsg}=payload;
                const tid=`${chat}__${mark}`;
                const t={live:true, room:chat, mark, ref:{key:{remoteJid:chat,fromMe:false,id:refId,participant:mark},message:refMsg}};
                this.slideLoop.set(tid,t);
                (async()=>{
                    while(t.live){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{ await this.socket.sendMessage(chat,{text:txt},{quoted:t.ref}); }catch{}
                        await delay(ms);
                    }
                })();
                if(notify) await this.send(chat,win('slide'));
                break;
            }
            case 'slide_stop':{
                for(const [k,v] of this.slideLoop) if(v.room===chat){v.live=false;this.slideLoop.delete(k);}
                if(notify) await this.send(chat,lose('slide'));
                break;
            }
            case 'voice_start':{
                const {txt,ms}=payload;
                const tid=`${chat}__vc`;
                const t={on:true};
                this.voiceLoop.set(tid,t);
                (async()=>{
                    while(t.on){
                        try{
                            const {buffer,mimetype,ptt}=await makeTTS(txt);
                            await this.socket.sendMessage(chat,{audio:buffer,mimetype,ptt});
                            await delay(ms);
                        }catch{ await delay(ms); }
                    }
                })();
                if(notify) await this.send(chat,win('voiceatk'));
                break;
            }
            case 'voice_stop':{
                const tid=`${chat}__vc`;
                if(this.voiceLoop.has(tid)){this.voiceLoop.get(tid).on=false;this.voiceLoop.delete(tid);}
                if(notify) await this.send(chat,lose('voiceatk'));
                break;
            }
            case 'img_start':{
                const {ms,data,mime}=payload;
                const tid=`${chat}__im`;
                const t={on:true,buf:Buffer.from(data,'base64'),mime};
                this.imgLoop.set(tid,t);
                (async()=>{ while(t.on){ try{await this.socket.sendMessage(chat,{image:t.buf,mimetype:t.mime});}catch{} await delay(ms); } })();
                if(notify) await this.send(chat,win('img'));
                break;
            }
            case 'img_stop':{
                const tid=`${chat}__im`;
                if(this.imgLoop.has(tid)){this.imgLoop.get(tid).on=false;this.imgLoop.delete(tid);}
                if(notify) await this.send(chat,lose('img'));
                break;
            }
            case 'pfp_start':{
                const {ms,data,mime}=payload;
                const tid=`${chat}__pf`;
                const t={on:true,buf:Buffer.from(data,'base64'),mime};
                this.pfpLoop.set(tid,t);
                (async()=>{
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{ await this.socket.updateProfilePicture(chat, t.buf); }catch{}
                        await delay(ms);
                    }
                })();
                if(notify) await this.send(chat,win('changepfp'));
                break;
            }
            case 'pfp_stop':{
                const tid=`${chat}__pf`;
                if(this.pfpLoop.has(tid)){this.pfpLoop.get(tid).on=false;this.pfpLoop.delete(tid);}
                if(notify) await this.send(chat,lose('changepfp'));
                break;
            }
            case 'desc_start':{
                const {txt}=payload;
                const tid=`${chat}__dc`;
                const t={on:true};
                this.descLoop.set(tid,t);
                const DESC_EMOJIS=['🔥','⚡','💀','👑','🎯','💣'];
                for(let i=0;i<6;i++){
                    (async(offset)=>{
                        let idx=offset*3;
                        while(t.on){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            const ms=timingMap.desc||100;
                            const emo = DESC_EMOJIS[idx++%DESC_EMOJIS.length];
                            try{ await this.socket.groupUpdateDescription(chat,`${emo} ${txt} ${emo}`); }catch{}
                            await delay(ms);
                        }
                    })(i);
                }
                if(notify) await this.send(chat,win('desc loop'));
                break;
            }
            case 'desc_stop':{
                for(const [k,v] of this.descLoop) if(k.startsWith(chat)){v.on=false;this.descLoop.delete(k);}
                if(notify) await this.send(chat,lose('desc'));
                break;
            }
            case 'MONU_start':{
                const {target,texts}=payload;
                const tid=`${chat}__ax_${target}`;
                const t={on:true};
                this.MONULoop.set(tid,t);
                (async()=>{
                    let idx=0;
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        const ms=timingMap.MONUswipe||6000;
                        const txt=texts[idx%texts.length];
                        idx++;
                        try{ await this.socket.sendMessage(chat,{text:txt},{quoted:{key:{remoteJid:chat,fromMe:false,participant:target},message:{conversation:''}}}); }catch{}
                        await delay(ms);
                    }
                })();
                if(notify) await this.send(chat,win('MONUswipe'));
                break;
            }
            case 'MONU_stop':{
                for(const [k,v] of this.MONULoop) if(k.startsWith(chat)){v.on=false;this.MONULoop.delete(k);}
                if(notify) await this.send(chat,lose('MONUswipe'));
                break;
            }
            case 'tspam_start':{
                const {targetName,ms}=payload;
                const tid=`${chat}__ts`;
                const t={on:true};
                this.tspamLoop.set(tid,t);
                (async()=>{
                    let emoIdx=0;
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        const emo = TSPAM_EMOJIS[emoIdx % TSPAM_EMOJIS.length];
                        emoIdx++;
                        const spamMsg = TSPAM_BASE.replace(/{TARGET}/g, targetName).replace(/{EMOJI}/g, emo);
                        try{ await this.socket.sendMessage(chat,{text:spamMsg}); }catch{}
                        await delay(ms);
                    }
                })();
                if(notify) await this.send(chat,win('tspam'));
                break;
            }
            case 'tspam_stop':{
                for(const [k,v] of this.tspamLoop) if(k.startsWith(chat)){v.on=false;this.tspamLoop.delete(k);}
                if(notify) await this.send(chat,lose('tspam'));
                break;
            }
            case 'kill_all':{
                for(const [k] of this.nameLoops) if(k.startsWith(chat)) this.nameLoops.delete(k);
                for(const [k,v] of this.wordLoop) if(k.startsWith(chat)) v.on=false;
                for(const [k,v] of this.timeLoop) if(k.startsWith(chat)) v.on=false;
                this.swipeLoop.delete(`${chat}__sw`);
                this.txtLoop.delete(`${chat}__tx`);
                for(const [k,v] of this.slideLoop) if(v.room===chat) v.live=false;
                this.voiceLoop.delete(`${chat}__vc`);
                this.imgLoop.delete(`${chat}__im`);
                this.pfpLoop.delete(`${chat}__pf`);
                this.replyLoop.delete(`${chat}__ar`);
                this.reactLoop.delete(`${chat}__rc`);
                for(const [k,v] of this.descLoop) if(k.startsWith(chat)) v.on=false;
                for(const [k,v] of this.MONULoop) if(k.startsWith(chat)) v.on=false;
                this.tspamLoop.delete(`${chat}__ts`);
                this.muteList.delete(chat);
                if(notify) await this.send(chat,`${TAG}\n\n🛑 All attacks killed`);
                break;
            }
            }
        }catch(e){}
    }

    async send(jid,text,mentions=[]){
        if(!this.socket||!this.online) return;
        try{
            await this.socket.sendMessage(jid,{text,...(mentions.length?{mentions}:{})});
        }catch(e){}
    }
}

// ═════════════════════════════════════════════
//  HUB  — Multi-user session isolation manager
// ═════════════════════════════════════════════
class Hub {
    constructor(){
        this.sessions = new Map();
        this.router   = new Router();
        this.count    = 0;
        this.disk     = readJson(PATH_NETWORK,{count:0,list:[]});
        this.count    = this.disk.count||0;
    }

    _save(){
        writeJson(PATH_NETWORK,{
            count:this.count,
            list:[...this.sessions.entries()].map(([id,s])=>({id,phone:s.phone,online:s.online}))
        });
    }

    async boot(){
        const saved=this.disk.list||[];
        if(saved.length){
            for(const entry of saved){
                const ap=PATH_AUTH(entry.id);
                const hasFiles=fs.existsSync(ap)&&fs.readdirSync(ap).length>0;
                let phone=entry.phone;
                if(!hasFiles&&!phone) continue;
                const s=new Session(entry.id,phone,this,null,null,true);
                this.sessions.set(entry.id,s);
                this.router.attach(entry.id,s);
                await s.init();
                await delay(1500);
            }
            this._save();
        }
    }

    async link(phone,notifyJid=null,ctx=null){
        this.count++;
        const id=`X${this.count}`;
        const s=new Session(id,phone,this,notifyJid,ctx,false);
        this.sessions.set(id,s);
        this.router.attach(id,s);
        await s.init();
        this._save();
        return `${TAG}\n\n⏳ ${g('session')} ${id}${g('created for')} +${phone}\n🔑 ${g('pairing code will arrive shortly')}`;
    }

    unlink(id){
        if(this.sessions.has(id)){ this.router.detach(id); this.sessions.delete(id); this._save(); }
    }
}

// ============================================================
// 📌 TELEGRAM BOT COMMANDS & MULTI-USER ISOLATION
// ============================================================
bot.use(async (ctx, next) => {
    if (ctx.callbackQuery) return next();
    const verification = await verifyAllChannels(ctx);
    if (!verification.success) {
        const msg = getForceJoinMessage(verification.failedChannel);
        const keyboard = getForceJoinKeyboard();
        await ctx.replyWithMarkdown(msg, keyboard);
        return;
    }
    return next();
});

bot.action('check_both', async (ctx) => {
    const verification = await verifyAllChannels(ctx);
    if (verification.success) {
        await ctx.answerCbQuery('✅ VERIFICATION SUCCESSFUL!', { show_alert: true });
        await ctx.deleteMessage().catch(()=>{});
        await ctx.replyWithMarkdown(MAIN_MENU(activeUnits.size));
    } else {
        await ctx.answerCbQuery(`❌ Join missing channel first!`, { show_alert: true });
    }
});

bot.start(async (ctx) => {
    const verification = await verifyAllChannels(ctx);
    if (!verification.success) return;
    await ctx.replyWithMarkdown(MAIN_MENU(activeUnits.size));
});

bot.command('connect', async (ctx) => {
    const text = ctx.message.text;
    const phone = text.split(' ')[1];
    const userId = ctx.from.id; // Telegram User ID for isolation[span_3](start_span)[span_3](end_span)
    
    if (!phone) {
        return ctx.replyWithMarkdown(`❌ **Format Error!**\nUse: \`/connect +919310435954\`[span_4](start_span)[span_4](end_span)`);
    }
    
    // Agar user ki purani session chal rahi hai toh use clean/unlink kar do taaki har user ka apna alag bot ho[span_5](start_span)[span_5](end_span)
    if (userSessions.has(userId)) {
        const oldId = userSessions.get(userId);
        hub.unlink(oldId);
        activeUnits.delete(oldId);
    }

    const cleanPhone = phone.replace(/\D/g, '');
    await ctx.replyWithMarkdown(`🔄 Initializing isolated WhatsApp session for +${cleanPhone}... Generating pairing code[span_6](start_span)[span_6](end_span)...`);
    
    hub.count++;
    const id = `U_${userId}_${hub.count}`;
    const s = new Session(id, cleanPhone, hub, null, ctx, false);
    hub.sessions.set(id, s);
    hub.router.attach(id, s);
    await s.init();
    hub._save();

    userSessions.set(userId, id);
    activeUnits.set(id, s);
});

bot.command('status', async (ctx) => {
    const userId = ctx.from.id;
    const userSessionId = userSessions.get(userId);
    const sessionObj = userSessionId ? hub.sessions.get(userSessionId) : null;
    
    if (!sessionObj || !sessionObj.online) {
        return ctx.replyWithMarkdown(`⚠️ Aapka koi active WhatsApp bot connected nahi hai. /connect [number] use karein[span_7](start_span)[span_7](end_span).`);
    }
    await ctx.replyWithMarkdown(`📊 Aapka Active Bot ID: ${userSessionId}\n📱 Number: +${sessionObj.phone}\n🟢 Status: Online[span_8](start_span)[span_8](end_span)`);
});

bot.command('logout', async (ctx) => {
    const userId = ctx.from.id;
    const userSessionId = userSessions.get(userId);
    
    if (!userSessionId || !hub.sessions.has(userSessionId)) {
        return ctx.replyWithMarkdown(`⚠️ Aapka koi active session nahi mila.`);
    }
    
    hub.unlink(userSessionId);
    activeUnits.delete(userSessionId);
    userSessions.delete(userId);
    
    await ctx.replyWithMarkdown(`🔌 Aapka WhatsApp session terminate aur clear kar diya gaya hai[span_9](start_span)[span_9](end_span).`);
});

// ─────────────────────────────────────────────
//  LAUNCH
// ─────────────────────────────────────────────
const hub = new Hub();
await hub.boot();

bot.launch().then(() => {
    log('💀MONU CYBER MASTER BOT + TELEGRAM ONLINE 💀', 'success');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
