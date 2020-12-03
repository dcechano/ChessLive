package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.H2AbstractRepo;
import com.example.chess.model.AbstractEntity;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Transactional
public abstract class H2AbstractRepoImpl<T extends AbstractEntity> implements H2AbstractRepo<T> {

    private final Class<T> clazz;

    protected EntityManager entityManager;

    public H2AbstractRepoImpl(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public void save(T entity) {
        entityManager.persist(entity);
    }

    @Override
    public void delete(T entity) {
        if (entityManager.contains(entity)) {
            entityManager.remove(entity);
        } else {
            var newEntity = entityManager.merge(entity);
            entityManager.remove(newEntity);
        }
    }

    @Override
    public T merge(T entity) {
        return entityManager.merge(entity);
    }

    @Override
    public void deleteById(Object id) {
        var entity = entityManager.find(clazz, id);
        entityManager.remove(entity);
    }

    @Override
    public Optional<T> findById(Object id) {
        var entity = entityManager.find(clazz, id);
        return Optional.ofNullable(entity);
    }

    @Override
    public List<T> findAll() {
        return (List<T>) entityManager.createQuery("SELECT e FROM " + clazz.getSimpleName() + " e").getResultList();
    }

    @PersistenceContext
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

}
