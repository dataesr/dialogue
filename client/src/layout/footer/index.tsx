import { Logo } from "@dataesr/dsfr-plus";

const { VITE_MINISTER_NAME, VITE_VERSION } = import.meta.env;

export default function LayoutFooter() {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a id="brand-link" title="Retour à l'accueil du site - [À MODIFIER - texte alternatif de l'image : nom de l'opérateur ou du site serviciel] - République Française" href="/">
              <Logo text={VITE_MINISTER_NAME} />
            </a>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a title="info.gouv.fr - nouvelle fenêtre" id="footer__content-link-0" href="https://info.gouv.fr" target="_blank" rel="noopener external" className="fr-footer__content-link">info.gouv.fr</a>
              </li>
              <li className="fr-footer__content-item">
                <a title="service-public.gouv.fr - nouvelle fenêtre" id="footer__content-link-1" href="https://service-public.gouv.fr" target="_blank" rel="noopener external" className="fr-footer__content-link">service-public.gouv.fr</a>
              </li>
              <li className="fr-footer__content-item">
                <a title="legifrance.gouv.fr - nouvelle fenêtre" id="footer__content-link-2" href="https://legifrance.gouv.fr" target="_blank" rel="noopener external" className="fr-footer__content-link">legifrance.gouv.fr</a>
              </li>
              <li className="fr-footer__content-item">
                <a title="data.gouv.fr - nouvelle fenêtre" id="footer__content-link-3" href="https://data.gouv.fr" target="_blank" rel="noopener external" className="fr-footer__content-link">data.gouv.fr</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a id="footer__bottom-link-4" href="#" className="fr-footer__bottom-link">Plan du site</a>
            </li>
            <li className="fr-footer__bottom-item">
              <a id="footer__bottom-link-5" href="#" className="fr-footer__bottom-link">Accessibilité : non/partiellement/totalement conforme</a>
            </li>
            <li className="fr-footer__bottom-item">
              <a id="footer__bottom-link-6" href="#" className="fr-footer__bottom-link">Mentions légales</a>
            </li>
            <li className="fr-footer__bottom-item">
              <a id="footer__bottom-link-7" href="#" className="fr-footer__bottom-link">Données personnelles</a>
            </li>
            <li className="fr-footer__bottom-item">
              <a id="footer__bottom-link-8" href="#" className="fr-footer__bottom-link">Gestion des cookies</a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href={`https://github.com/dataesr/tableaux/releases/tag/v${VITE_VERSION}`} title={`v${VITE_VERSION} - Nouvelle fenêtre`} rel="noreferrer noopener external" target="_blank">
                {`v${VITE_VERSION}`}
              </a>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noopener external" title="Licence etalab - nouvelle fenêtre">licence etalab-2.0</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}