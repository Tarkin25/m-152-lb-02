import Head from "next/head";
import React, { Fragment } from "react";

const ImpressumPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Impressum - Rubik's Cube</title>
      </Head>

      <main className="p-4">
        <h2 className="text-4xl mt-2 mb-4">Impressum</h2>

        <h2 className="text-2xl my-2">Kontaktadresse</h2>
        <p>
          Severin Weigold IT
          <br />
          Ausstellungsstrasse 70
          <br />
          8005 Zürich
          <br />
          Schweiz
          <br />
          severin.weigold@edu.tbz.ch
        </p>
        <h2 className="text-2xl my-2">Vertretungsberechtigte Personen</h2>
        <p>Severin Weigold, CEO, CTO, Putzfrau</p>
        <h2 className="text-2xl my-2">Haftungsausschluss</h2>
        <p>
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen
          Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und
          Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor
          wegen Schäden materieller oder immaterieller Art, welche aus dem
          Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
          Informationen, durch Missbrauch der Verbindung oder durch technische
          Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind
          unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der
          Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu
          verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise
          oder endgültig einzustellen.
        </p>
        <h2 className="text-2xl my-2">Haftung für Links</h2>
        <p>
          Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres
          Verantwortungsbereichs Es wird jegliche Verantwortung für solche
          Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten
          erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
        </p>
        <h2 className="text-2xl my-2">Urheberrechte</h2>
        <p>
          Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder
          anderen Dateien auf der Website gehören ausschliesslich der Firma
          Severin Weigold IT oder den speziell genannten Rechtsinhabern. Für die
          Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der
          Urheberrechtsträger im Voraus einzuholen.
        </p>
        <h2 className="text-2xl my-2">Quelle</h2>
        <p>
          Dieses Impressum wurde am 29.06.2021 mit dem Impressum Generator der
          Webdesign Agentur{" "}
          <a
            href="https://webkoenig.ch/"
            target="_blank"
            className="text-blue-700 underline"
          >
            Webkönig
          </a>{" "}
          erstellt. Die Agentur Webkönig übernimmt keine Haftung.
        </p>
      </main>
    </Fragment>
  );
};

export default ImpressumPage;
