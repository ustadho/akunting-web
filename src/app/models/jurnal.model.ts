export class BuktiKasBank {
  id: string;
  tipe: string;
  idPerusahaan: number;
  idAkunKasBank: number;
  kodeAkunKasBank: string;
  nomor: string;
  tanggal: Date;
  chequeNo: string;
  voidCheque: Boolean;
  keterangan: string;
  payee: string;
  amount: number;
  detId: string;
  detail: BuktiKasBankDetail[];
}

export class BuktiKasBankDetail {
  id: string;
  idAkun: number;
  kodeAkun: string;
  namaAkun: string;
  amount: number;
  memo: string;
  seq: number;
}

export class JurnalEntry {
  id: string;
  idPerusahaan: number;
  nomor: string;
  tanggal: Date;
  keterangan: string;
  detail: JurnalEntryDetail[];
}

export class JurnalEntryDetail {
  id: string;
  idAkun: number;
  kodeAkun: string;
  namaAkun: string;
  debet: number;
  kredit: number;
  rate: number;
  primeAmount: number;
  keterangan: string;
  idKapalBerangkat: number
  seq: number;
}
