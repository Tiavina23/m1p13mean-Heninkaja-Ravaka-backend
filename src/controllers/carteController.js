const Produit = require('../models/Produit');
const Promotion = require('../models/Promotion');

exports.getCarte = async (req, res) => {
    try {
        const now = new Date();
        
        // 1. On récupère TOUS les produits de la base
        const tousLesProduits = await Produit.find().lean();

        // 2. On cherche les promotions qui sont VALIDES AUJOURD'HUI
        const promosActives = await Promotion.find({
            dateDebut: { $lte: now },
            dateFin: { $gte: now }
        }).lean();

        // 3. On construit la réponse
        const carteComplete = tousLesProduits.map(produit => {
            // On cherche si l'ID de ce produit est dans une des promos actives
            const promoMatch = promosActives.find(p => 
                p.produits.some(prodId => prodId.toString() === produit._id.toString())
            );

            if (promoMatch) {
                // PRODUIT EN PROMO
                return {
                    ...produit,
                    enPromotion: true,
                    taux: promoMatch.tauxReduction,
                    prixOriginal: produit.prix,
                    prixPromotion: Math.round((produit.prix * (1 - promoMatch.tauxReduction / 100)) * 100) / 100
                };
            }

            // PRODUIT NORMAL (On garde quand même prixOriginal pour le frontend)
            return { 
                ...produit, 
                enPromotion: false, 
                prixOriginal: produit.prix 
            };
        });

        res.status(200).json(carteComplete);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};