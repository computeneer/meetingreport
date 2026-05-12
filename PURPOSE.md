# Projenin amacı

- Toplantılarda alınan notların kaydedilmesi.
- Toplantıda kimlere hangi task atandı onların not alınması.

## Projedeki sayfalar

- Home: Mevcut toplantıların ve kimlere hangi task atandı bilgilerinin listelenmesi
- Meetings: Mevcut toplantıların listelenmesi, yeni toplantı eklenmesi, düzenlenmesi ve silinmesi (silerken bir onay modalı çıkmalı).
- Tasks : Kimlere hangi tasklar atandı bunların listelenmesi ("Ahmet: Database migration işlemlerini yapılması" tarzında), yeni task atamalarının yapılması (statik bir listeden select ile seçim yapılacak, task textbox üzerinden girilecek). Atamaların düzenlenmesi ve silinmesi.

## Projenin mimarisi

- Mümkün olduğunda temiz bir mimari kullanılması gerekiyor. Tekrar kullanılabilir componentlerin reusable olarak yazılması önemli.
- Mümkün olduğunca minimal bir sistem istiyoruz. Backend yazılmayacak bunun yerine json-server kullanılacak.

## Arayüz

- Tailwindcss ve motion kullanılarak modern bir arayüz.
- Renk paleti olarak : #1E104E, #452E5A, #FF653F, #FFC85C kullanmayı planlıyoruz.
